var fs = require( 'fs' ),
    path = require( 'path' ),
    mocha = require( 'mocha' );

module.exports = {
    test: function( pie ) {
        // First, get the pie if it's not an object
        if ( typeof pie === 'string' ) {
            pie = getPie( pie );
        }
    },

    testAll: function() {
        // Get all the pies
        var pies = getAllPies();

        // For each pie, run mocha
        Object.keys( pies ).forEach( function( pie ) {
            this.test( pies[ pie ] );
        }, this );
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

