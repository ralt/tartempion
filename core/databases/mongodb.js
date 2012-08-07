var mongodb = require( 'mongodb' ),
    Server = mongodb.Server,
    Db = mongodb.Db,
    database;

var MongoModule = {};

MongoModule.setup = function() {
    // Initialize the db connection
    var client = new Db( this.config.databaseName,
        new Server(
            this.config.serverConfig.address,
            this.config.serverConfig.port,
            this.config.serverConfig.options
        ),
        this.config.options
    );

    client.open( function( err, db ) {
        if ( err ) throw err;
        database = db;
        console.log( 'Database driver loaded.' );
    });
};

MongoModule.collection = function() {
    database.collection.apply( this, arguments );
};

module.exports = function( config ) {
    MongoModule.config = config;
    return MongoModule;
};

