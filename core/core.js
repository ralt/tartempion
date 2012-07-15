module.exports = function() {
    // Load the configuration
    var config = loadConfig();
    console.log( 'Configuration loaded.' );

    // Load the express server
    var app = express( config );

    // Load the pies
    loadPies();

    // Run the server
    app.listen( config.port, function() {
        var address = app.address();
        console.log( 'Tartempion listening on: '
            + address.address + ':'
            + address.port
        );
    });
};

var fs = require( 'fs' );

/**
 * Load the configuration file and return it as an object
 */
function loadConfig() {
    var config = fs.readFileSync( './config.json' );
    return JSON.parse( config );
}

function express( config ) {
    var path = require( 'path' ),
        express = require( 'express' ),
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
    console.log( JSON.parse( pies ) );
}

