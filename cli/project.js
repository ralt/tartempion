var wrench = require( 'wrench' ),
    fs = require( 'fs' ),
    path = require( 'path' );

module.exports = {
    /**
     * Create a project with the default files and folders.
     *
     * The default hierarchy can be found in the folder cli/default/
     * of the tartempion module.
     *
     * The only thing to dynamically create is the package.json file.
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

        console.log( '\nCreating the package.json file...' );

        // Open the package.json file and fill it in
        // with the correct datas.

        var packagePath = path.join( current, project, 'package.json' );
        // First, get the datas
        var pack = JSON.parse( fs.readFileSync( packagePath ));

        // Add the properties in the object
        pack.name = project;
        pack.version = '0.0.1';
        pack.dependencies = {
            'tartempion': '0.0.x'
        };

        // And write the object to the package.json file
        // by overriding everything in it.
        fs.writeFileSync( packagePath, JSON.stringify( pack, null, 4 ) );

        console.log( '\nProject "' + project + '" created.\n' );
    }
};

