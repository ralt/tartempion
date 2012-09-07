'use strict';

var mongodb = require( 'mongodb' ),
    Server = mongodb.Server,
    Db = mongodb.Db,
    mongoStore = require( 'connect-mongodb' );

function connect( config ) {
    return new Db( config.databaseName,
        new Server(
            config.serverConfig.address,
            config.serverConfig.port,
            config.serverConfig.options
        ),
        config.options
    );
}

module.exports = function( config ) {
    return new mongoStore( { db: connect( config.database.mongodb ) } );
};

