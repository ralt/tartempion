#!/usr/bin/env node 
/**
 * File implementing the CLI interface
 */
var program = require( 'commander' );

program.version( '0.0.3' );

program
    .command( 'create-project <project>' )
    .description( 'Create a project named <project>' )
    .action( require( './project.js' ).createProject );

program
    .command( 'create-pie <pie>' )
    .description( 'Create a pie named <pie>' )
    .action( require( './pie.js' ).createPie );

program
    .command( 'run' )
    .description( 'Run tartempion' )
    .action( require( './system.js' ).run );

program.parse( process.argv );

