#!/usr/bin/env node

'use strict';

/**
 * File implementing the CLI interface
 */
var program = require( 'commander' ),
    fs = require( 'fs' ),
    path = require( 'path' ),
    test = require( './test.js' ),
    project = require( './project.js' ),
    pie = require( './pie.js' ),
    system = require( './system.js' );

// Get the package.json file to get the version
var version = require(
    path.join( __dirname, '..', 'package.json' )
).version;

program.version( version );

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
    .command( 'test <pie>' )
    .description( 'Run the tests in the pie <pie>' )
    .action( test.test );

program
    .command( 'test-all' )
    .description( 'Run the tests in all the pies' )
    .action( test.testAll );

program
    .command( 'help' )
    .description( 'Show help' )
    .action( system.help );

program.parse( process.argv );

// Special case: no argument. Display the help.
if ( process.argv.length < 3 ) {
    system.help();
}

