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
            this.use( express.session( {
                secret: config.session.secret,
                cookie: {
                    maxAge: config.session.maxAge
                }
            }));
        }
    });

    return app;
};

