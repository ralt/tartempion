var cp = require( 'child_process' ),
    spawn = require( 'child_process' ).spawn,
    fs = require( 'fs' );

module.exports = {
    // Run tartempion
    run: function() {
        // First check if the tartempion.js file exists
        var files = fs.readdirSync( process.cwd() );
        if ( !~files.indexOf( 'tartempion.js' ) ) {
            console.error( "\nThe tartempion.js file doesn't exist." );
            console.error( "Are you sure you're at the root of your folder?\n" );
            process.exit( -1 );
        }

        // Spawn the process
        var node = spawn( 'node', [ 'tartempion.js' ] );

        // And send each output to stdout
        node.stdout.on( 'data', function( data ) {
            process.stdout.write( data );
        });
    },

    // Show help
    help: function() {
        // Just run tartempion with the --help option
        cp.exec( 'tartempion --help',
            function( err, stdout, stderr ) {
            if ( err ) throw err;
            process.stdout.write( stdout );
        });
    }
};

