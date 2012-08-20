var generator = require( 'docgenerator' ),
    path = require( 'path' ),
    fs = require( 'fs' );

// Get all the markdown files in this folder
var files = fs.readdirSync( path.join( 'original' ) );

files = files
    .filter( function( file ) {
        return file.substr( -3 ) === '.md';
    })
    .map( function( file ) {
        return path.join( 'original', file );
    })
    .sort();

generator
    .set( 'format', 'book' )
    .set( 'output', 'documentation.html' )
    .set( 'input', files )
    .generate();

