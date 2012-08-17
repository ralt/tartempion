#!/usr/bin/env node 
/**
 * File implementing the CLI interface
 */
var program = require( 'commander' ),
    project = require( './project.js' ),
    pie = require( './pie.js' ),
    system = require( './system.js' );

program.version( '0.0.3' );

program
    .command( 'create-project <project>' )
    .description( 'Create a project named <project>' )
    .action( project.createProject );

program
    .command( 'create-pie <pie>' )
    .description( 'Create a pie named <pie>' )
    .action( pie.createPie );

program
    .command( 'run' )
    .description( 'Run tartempion' )
    .action( system.run );

program
    .command( 'help' )
    .description( 'Show help' )
    .action( system.help );

program.parse( process.argv );

