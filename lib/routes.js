var path = require( 'path' ),
    fs = require( 'fs' );

module.exports = {
    load: function( app, pies ) {
        // Load the route for each pie
        Object.keys( pies ).forEach( function( pie ) {
            var routes = path.join( process.cwd(), 'pies', pies[ pie ].path, 'routes.json' );
            routes = fs.readFileSync( routes );
            routes = JSON.parse( routes );

            // Now add each route to the app
            addRoutes( pies, pie, routes, app );
        });

        console.log( 'Routes loaded.' );
    }
};

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
                path.join( process.cwd(), 'middlewares', 'middlewares.js' )
            )[ middleware ];
        });

        // Also, let's not forget to change the function to call
        fn = fn.method;
    }

    // Then, load the route
    app[ method ]( route, middlewares, require(
        path.join( process.cwd(), 'pies', piePath, 'controller.js' )
    ) [ fn ] );
}

