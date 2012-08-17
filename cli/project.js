var wrench = require( 'wrench' ),
    fs = require( 'fs' ),
    path = require( 'path' );

module.exports = {
    /**
     * Create a project with the default files and folders.
     *
     * The default hierarchy can be found in the folder cli/default/
     * of the tartempion module. The only thing to dynamically create
     * is the package.json file.
     */
    createProject: function( project ) {
        var current = process.cwd();

        console.log( '\nCreating folder "' + project + '"...' );

        // First, create the directory
        fs.mkdirSync( path.join( current, project ) );

        console.log( '\nCopying the files in "' + project + '"...' );

        // Then, copy the files into it
        wrench.copyDirSyncRecursive(
            path.join( __dirname, 'default', 'project' ),
            path.join( current, project )
        );

        console.log( '\nProject "' + project + '" created.\n' );
    }
};

