var fs = require( 'fs' ),
    path = require( 'path' );

module.exports = function() {
    // Load the configuration
    var config = loadConfig();
    console.log( 'Configuration loaded.' );

    // Load the express server
    var app = express( config );

    // Load the pies
    var pies = loadPies();

    // Add them to ncore
    var ncoredPies = addPiesToNcore( pies );

    // And run them
    ncoredPies.init();

    // Then, load the routes
    loadRoutes( app, pies );

    // Run the server
    app.listen( config.port, function() {
        var address = app.address();
        console.log( 'Tartempion listening on: '
            + address.address + ':'
            + address.port
        );
    });
};

/**
 * Load the configuration file and return it as an object
 */
function loadConfig() {
    var config = fs.readFileSync( './config.json' );
    return JSON.parse( config );
}

function express( config ) {
    var express = require( 'express' ),
        app = express.createServer();

    // Configuration of express
    app.configure( function() {
        this.set( 'views', path.join(
            __dirname, config.views
        ));
        this.set( 'view engine', config[ 'view engine' ] );
        this.use( express.bodyParser() );
        if ( 'session' in config ) {
            this.use( express.session( {
                secret: config.session.secret,
                cookie: {
                    maxAge: config.session.maxAge
                }
            }));
        }
    });

    return app;
}

function loadPies() {
    var pies = fs.readFileSync( './pies.json' );
    return JSON.parse( pies );
}

/**
 * This function just loads the dependencies in an object
 * and initializes ncore.
 */
function addPiesToNcore( pies ) {
    var ncore = require( 'ncore' ),
        deps = {};

    // Inject each model into the controller
    Object.keys( pies ).forEach( function( pie ) {
        deps[ pie + "Controller" ] = {
            "model": pie + "Model"
        };
        // Inject each pie's dependency in the pie (controller and model)
        if ( 'dependencies' in pies[ pie ] ) {
            pies[ pie ].dependencies.forEach( function( dep ) {
                deps[ pie + "Controller" ][ dep ] = dep + "Controller";
            });
        }
    });

    // Create an ncore instance and add the modules
    ncore.constructor( deps );

    Object.keys( pies ).forEach( function( pie ) {
        // For each pie, add the model and the controller
        // But first, get the path:
        var piePath = path.join( __dirname, '..', 'pies', pies[ pie ].path );
        ncore.add( pie + "Controller", require(
            path.join( piePath, 'controller.js' )
        ));
        ncore.add( pie + "Model", require(
            path.join( piePath, 'model.js' )
        ));
    });

    return ncore;
}

/**
 * Load each route and add them to the app object
 */
function loadRoutes( app, pies ) {
    // Load the route for each pie
    Object.keys( pies ).forEach( function( pie ) {
        var routes = path.join( __dirname, '..', 'pies', pies[ pie ].path, 'routes.json' );
        routes = fs.readFileSync( routes );
        routes = JSON.parse( routes );

        // Now add each route to the app
        addRoutes( pie, routes, app );
    });
}

/**
 * Add ALL the routes!
 */
function addRoutes( pie, routes, app ) {
    // Add the GET routes
    routes.get.forEach( function( route ) {
        Object.keys( route ).forEach( function( r ) {
            app.get( r, pie[ route[ r ] ] );
        });
    });

    // Add the POST routes
    routes.post.forEach( function( route ) {
        Object.keys( route ).forEach( function( r ) {
            app.post( r, pie[ route[ r ] ] );
        });
    });
}

