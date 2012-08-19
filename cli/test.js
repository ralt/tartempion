var fs = require( 'fs' ),
    path = require( 'path' );

module.exports = {
    getEngine: function( engine ) {
        // This function is necessary to only require once
        // even when a function is called several times
        if ( !this.engine ) {
            this.engine = require(
                path.join( __dirname, 'testengines', engine.name + '.js' )
            )( engine.options );
        }
        return this.engine;
    },

    test: function( pie ) {
        // First, get the pie if it's not an object
        if ( typeof pie === 'string' ) {
            pie = getPie( pie );
        }

        // Get the config to know which test engine to use
        var config = JSON.parse(
            fs.readFileSync(
                path.join( process.cwd(), 'config.json' )
            )
        );

        // Set the list of supported test engines
        var supported = [
            'mocha'
        ];

        // If the test engine isn't part of the supported ones,
        // stop the program immediately.
        if ( !~supported.indexOf( config[ 'test engine' ].name ) ) {
            console.error( 'Test engine not supported.' );
            process.exit( -1 );
        }

        // Run the test engine
        module.exports.getEngine( config[ 'test engine' ] ).test( pie );
    },

    testAll: function() {
        // Get all the pies
        var pies = getAllPies();

        // For each pie, run mocha
        Object.keys( pies ).forEach( function( pie ) {
            module.exports.test( pies[ pie ] );
        });
    }
};

function getAllPies() {
    // Get the pies.json file
    return JSON.parse(
        fs.readFileSync(
            path.join( process.cwd(), 'pies.json' )
        )
    );
}

function getPie( pie ) {
    // Get the pies.json file
    var pies = getAllPies();

    // And return only the requested one
    return pies[ pie ];
}

