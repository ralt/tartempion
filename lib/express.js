'use strict';

var path = require( 'path' );

module.exports = function( config ) {
    var express = require( 'express' ),
        app = express();

    // Configuration of express
    app.configure( function() {
        this.set( 'views', path.join(
            process.cwd(), config.templates.folder
        ));
        this.set( 'view engine', config.templates[ 'template engine' ] );
        this.use( express.bodyParser() );
        this.use( express.cookieParser() );
        if ( 'session' in config ) {

            // Load the supported stores supported
            var supported = require(
                path.join( __dirname, '..', 'supported.json' )
            );

            // Test if the config's is supported
            if ( !~supported.session.indexOf( config.session.store ) ) {
                throw new Error( 'The session store driver ' +
                    config.session.store +
                    ' is not supported by tartempion.' );
            }

            // And load the appropriate session store
            this.use( express.session( {
                store: require(
                    path.join(
                        __dirname,
                        'sessions',
                        config.session.store + '.js'
                    )
                )( config ),
                secret: config.session.secret,
                cookie: {
                    maxAge: config.session.maxAge
                }
            }));
        }
    });

    return app;
};

