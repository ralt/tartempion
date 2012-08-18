var Mocha = require( 'mocha' ),
    mocha = new Mocha,
    fs = require( 'fs' ),
    path = require( 'path' );

module.exports = {
    // Run the test using mocha on a pie
    test: function( pie ) {
        // Get all the test files of this pie
        var files = fs.readdirSync(
            path.join( process.cwd(), 'pies', pie.path, 'test' )

        ).filter( function( file ) {
            // Keep only the .js files
            return file.substr( -3 ) === '.js';

        }).forEach( function( file ) {
            // Add each file to mocha
            mocha.addFile(
                path.join(
                    process.cwd(),
                    'pies',
                    pie.path,
                    'test',
                    file
                )
            );
        });

        // If there is no file to test in this pie, just return
        if ( mocha.files.length === 0 ) {
            return;
        }

        // Get the pie name by splitting the path
        var pieName = pie.path.split( '/' ).reverse()[ 0 ];

        console.log( '\nRunning tests for ' + pieName );

        // And run mocha tests while setting the reporter to "list"
        mocha.reporter( 'list' ).run();
    }
};

