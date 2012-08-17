var cp = require( 'child_process' );

module.exports = {
    // Run tartempion
    run: function() {
    },

    // Show help
    help: function() {

        // Just run tartempion with the --help option
        cp.exec( 'tartempion --help',
            function( err, stdout, stderr ) {
            process.stdout.write( stdout );
        });
    }
};

