module.exports = {
    getDatabase: function( dbConf ) {
        var supported = [ 'mongodb' ];

        var db = Object.keys( dbConf ).antiDiff( supported );
        if ( db.length === 0 ) {
            console.log( 'Database driver not supported.' );
            process.exit( 1 );
        }

        // If it's not the special "memory" database
        if ( db !== 'memory' ) {
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

