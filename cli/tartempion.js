#!/usr/bin/env node 
/**
 * File implementing the CLI interface
 */
var program = require( 'commander' );

program.version( '0.0.3' );

program
    .command( 'create-project <project>' )
    .description( 'Create a project named <project>' )
    .action( function( project ) {
        console.log( project );
    });

program
    .command( 'create-pie <pie>' )
    .description( 'Create a pie named <pie>' )
    .action( function( pie ) {
        console.log( pie );
    });

program
    .command( 'run' )
    .description( 'Run tartempion' )
    .action( function() {
        console.log( 'tartempion running' );
    });

program.parse( process.argv );

