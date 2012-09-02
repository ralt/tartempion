'use strict';

var fs = require( 'fs' ),
    path = require( 'path' ),
    wrench = require( 'wrench' );

module.exports = {
    /**
     * Create a pie in the pies/ folder
     * with the default files.
     *
     * The default files are those available
     * in the cli/default/pie/ folder.
     *
     * Also, it adds the pie to the pies.json file.
     */
    createPie: function( pie ) {
        var current = process.cwd();

        // First, check if there is a pies/ folder
        var files = fs.readdirSync( current );
        if ( !~files.indexOf( 'pies' ) ) {
            // If it doesn't exist, we're doing something wrong
            console.error( "\nThe pies/ folder doesn't exist." );
            console.error( "Are you sure you're at the root of your folder?\n" );
            process.exit( -1 );
        }

        console.log( '\nCreating folder pies/' + pie + '...' );

        // First, create the directory
        wrench.mkdirSyncRecursive( path.join( current, 'pies', pie ) );

        console.log( '\nCopying the files in pies/' + pie + '...' );

        // Then, copy the files into it
        wrench.copyDirSyncRecursive(
            path.join( __dirname, 'default', 'pie' ),
            path.join( current, 'pies', pie )
        );

        // Now, get the pies.json and add the new pie to it
        var piesPath = path.join( current, 'pies.json' );

        // First, get the datas
        var pies = JSON.parse( fs.readFileSync( piesPath ) );

        // We need to check if the pie has a "/", it'd mean
        // that the path property is different than the name.
        var pieName;
        if ( ~pie.indexOf( '/' ) ) {
            pieName = pie.split( '/' ).reverse()[ 0 ];
        }
        else {
            pieName = pie;
        }

        // Add the new property to it
        pies[ pieName ] = {
            path: pie
        };

        // And write the object back to the file
        fs.writeFileSync( piesPath, JSON.stringify( pies, null, 4 ) );

        console.log( '\nPie "' + pie + '" created.\n' );
    }
};

