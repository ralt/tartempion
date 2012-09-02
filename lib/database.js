'use strict';

var fs = require( 'fs' ),
    path = require( 'path' );

module.exports = {
    getDatabase: function( dbConf ) {
        // Load supported databases
        var supported = JSON.parse(
            fs.readFileSync(
                path.join( __dirname, '..', 'supported.json' )
            )
        )[ 'databases' ];

        var db = Object.keys( dbConf ).antiDiff( supported );
        if ( db.length === 0 ) {
            console.log( 'Database driver not supported.' );
            process.exit( 1 );
        }

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

        return db;
    },

    loadConstructor: function( pies ) {
        // Create the constructor, we need each pie
        var deps = {};
        Object.keys( pies ).forEach( function( pie ) {
            deps[ pie + 'Model' ] = { 'db': 'dbModule' };
        });
        return deps;
    }
};

