var check = require( './check.js' );

module.exports = {
    // Create a pie in the pies/ folder
    // with the default files
    createPie: function( pie ) {

        // Firstly, if you're not in a project,
        // stop immediately.
        if ( !check.isInProject ) {
            console.error( "You're not in a project's folder." );
            process.exit( -1 );
        }
    }
};

