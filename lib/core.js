var fs = require( 'fs' ),
    path = require( 'path' );

// Require the prototype methods we need
require( './prototype.js' );

module.exports = function() {
    // Load the configuration
    var config = JSON.parse( fs.readFileSync( './config.json' ) );
    console.log( 'Configuration loaded.' );

    // Load the express server
    var app = require( './express.js' )( config );

    // Load the locals
    require( './locals.js' )( app );

    // Load the pies and the pies' handler
    var pies = JSON.parse( fs.readFileSync( './pies.json' ) ),
        piesHandler = require( './pies.js' );

    // Load the pies constructor
    var constructor = piesHandler.loadConstructor( pies );

    // Load the db handler
    var dbHandler = require( './database.js' );

    // Load the database module
    var dbModule = dbHandler.getDatabase( config.database );

    // Load the database constructor and merge it with the pies'
    constructor = Object.merge(
        dbHandler.loadConstructor( pies ), constructor
    );

    // Add the pies to ncore
    var ncored = piesHandler.addToNcore( pies, constructor );

    // Add the db to ncore
    ncored.add( 'dbModule',
        require(
            './databases/' + dbModule + '.js'
        )( config.database[ dbModule ] )
    );

    console.log( 'nCore constructor loaded.' );

    // And run ncore
    ncored.init();

    // Then, load the routes
    var routesHandler = require( './routes.js' );
    routesHandler.load( app, pies );

    // Run the server
    app.listen( config.server.port, function() {
        var address = app.address();
        console.log( 'Tartempion listening on: '
            + address.address + ':'
            + address.port
        );
    });
};

// Add an event object to have it available
// to end-apps.
( function() {
    var EventEmitter = require( 'events' ).EventEmitter;
    module.exports.EventEmitter = new EventEmitter;
}());

