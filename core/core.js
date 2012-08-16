var fs = require( 'fs' ),
    path = require( 'path' );

// Require the prototype methods we need
require( './prototype.js' );

module.exports = function() {
    // Load the configuration
    var config = JSON.parse( fs.readFileSync( './config.json' ) );
    console.log( 'Configuration loaded.' );

    // Load the express server
    var app = require( './express.js' )( config );

    // Load the helpers
    require( './helpers.js' )( app );

    // Load the pies and the pies' handler
    var pies = JSON.parse( fs.readFileSync( './pies.json' ) ),
        piesHandler = require( './pies.js' );

    // Load the pies constructor
    var constructor = piesHandler.loadConstructor( pies );

    // Load the db handler
    var dbHandler = require( './database.js' );

    // Load the database module
    var dbModule = dbHandler.getDatabase( config.database );

    // Load the database constructor and merge it with the pies'
    constructor = Object.merge(
        dbHandler.loadConstructor( pies ), constructor
    );

    // Add the pies to ncore
    var ncored = addPiesToNcore( pies, constructor );

    // Add the db to ncore
    ncored.add( 'dbModule',
        require(
            './databases/' + dbModule + '.js'
        )( config.database[ dbModule ] )
    );

    console.log( 'nCore constructor loaded.' );

    // And run ncore
    ncored.init();

    // Then, load the routes
    loadRoutes( app, pies );

    // Run the server
    app.listen( config.server.port, function() {
        var address = app.address();
        console.log( 'Tartempion listening on: '
            + address.address + ':'
            + address.port
        );
    });
};

/**
 * This function just loads the dependencies in an object
 * and initializes ncore.
 */
function addPiesToNcore( pies, constructor ) {
    var ncore = require( 'ncore' );

    // Create an ncore instance and add the modules
    ncore.constructor( constructor );

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

    console.log( 'Pies loaded.' );

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
        addRoutes( pies, pie, routes, app );
    });

    console.log( 'Routes loaded.' );
}

/**
 * Add ALL the routes!
 */
function addRoutes( pies, pie, routes, app ) {
    // Add the GET routes
    if ( 'get' in routes ) {
        routes.get.forEach( function( route ) {
            Object.keys( route ).forEach( function( r ) {
                var middlewares = true;
                if ( typeof route[ r ] === 'string' ) {
                    middlewares = false;
                }
                loadRoute( app, 'get', r, pies[ pie ].path, route[ r ], middlewares );
            });
        });
    }

    // Add the POST routes
    if ( 'post' in routes ) {
        routes.post.forEach( function( route ) {
            Object.keys( route ).forEach( function( r ) {
                var middlewares = true;
                if ( typeof route[ r ] === 'string' ) {
                    middlewares = false;
                }
                loadRoute( app, 'post', r, pies[ pie ].path, route[ r ], middlewares );
            });
        });
    }
}

/**
 * Load *one* route
 */
function loadRoute( app, method, route, piePath, fn, middleware ) {
    var middlewares = [];
    // If there is some middleware, load it
    if ( middleware ) {
        middlewares = fn.middlewares.map(
            function( middleware ) {
            return require(
                path.join( __dirname, '..', 'middlewares', 'middlewares.js' )
            )[ middleware ];
        });

        // Also, let's not forget to change the function to call
        fn = fn.method;
    }

    // Then, load the route
    app[ method ]( route, middlewares, require(
        path.join( __dirname, '..', 'pies', piePath, 'controller.js' )
    ) [ fn ] );
}

// Add an event object to have it available
// to end-apps.
( function() {
    var EventEmitter = require( 'events' ).EventEmitter;
    module.exports.EventEmitter = new EventEmitter;
}());

