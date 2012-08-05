var fs = require( 'fs' ),
    path = require( 'path' );

module.exports = function() {
    // Load the configuration
    var config = loadConfig();
    console.log( 'Configuration loaded.' );

    // Load the express server
    var app = express( config );

    // Load the helpers
    loadHelpers( app );

    // Load the pies
    var pies = JSON.parse( fs.readFileSync( './pies.json' ) );

    // Load the pies constructor
    var constructor = loadPiesConstructor( pies );

    // Load the database module
    var dbModule = getDatabase( config.database );

    // Load the database constructor and merge it with the pies'
    constructor = Object.merge( loadDbConstructor( pies ), constructor );

    // Add the pies to ncore
    var ncored = addPiesToNcore( pies, constructor );

    // Add the db to ncore
    ncored.add( 'dbModule',
        require( './core/databases/' + dbModule + '.js' )( config.database )
    );

    console.log( 'nCore constructor loaded.' );

    // And run ncore
    ncored.init();

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
            __dirname, '..', config.views
        ));
        this.set( 'view engine', config[ 'view engine' ] );
        this.use( express.bodyParser() );
        this.use( express.cookieParser() );
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

function loadPiesConstructor( pies ) {
    var deps = {};

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

    // And return the constructor
    return deps;
}

function loadDbConstructor( pies ) {
    // Create the constructor, we need each pie
    var deps = {};
    Object.keys( pies ).forEach( function( pie ) {
        deps[ pie + 'Model' ] = { 'db': 'dbModule' };
    });
    return deps;
}

/**
 * This function just loads the dependencies in an object
 * and initializes ncore.
 */
function addPiesToNcore( pies, constructor ) {
    var ncore = require( 'ncore' );

    console.log( constructor );

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

/**
 * Load the helpers
 */
function loadHelpers( app ) {
    // Load the helpers file
    var helpers = require(
        path.join( __dirname, '..', 'helpers', 'helpers.js' )
    );

    // First take care of the helpers
    app.helpers( helpers.helpers );

    // Then the dynamicHelpers
    app.dynamicHelpers( helpers.dynamicHelpers );

    console.log( 'Helpers loaded.' );
}

/**
 * Load the database specified in the config file
 */
function getDatabase( dbConf ) {
    var supported = [ 'mongodb', 'memory' ];
    var db = Object.keys( dbConf ).antiDiff( supported );
    if ( db.length === 0 ) {
        console.log( 'Database driver not supported.' );
        process.exit( 1 );
    }

    // If it's not the special "memory" database
    if ( db[ 0 ] !== 'memory' ) {
        // Try to load the specified driver
        var driver;
        try {
            driver = require( db );
        }
        catch( e ) {
            if ( e.code === 'MODULE_NOT_FOUND' ) {
                console.error( 'Module driver not found. Install ' + db + ' via npm.' );
                process.exit( 1 );
            }
        }
    }

    return db[ 0 ];
}

/**
 * Anti-diff method
 */
Array.prototype.antiDiff = function( arr ) {
    return arr.map( function( v ) {
        if ( !!~this.indexOf( v ) ) return v;
    }, this ).filter( Boolean )[ 0 ];
};

Object.merge = function () {
    return [].reduce.call( arguments, function ( ret, merger ) {
        Object.keys( merger ).forEach(function ( key ) {
            ret[ key ] = merger[ key ];
        });
        return ret;
    }, {} );
};

