var mongodb = require( 'mongodb' ),
    Server = mongodb.Server,
    Db = mongodb.Db;

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

    var that = this;

    client.open( function( err, db ) {
        if ( err ) throw err;
        that.db = db;
        console.log( 'Database driver loaded.' );
    });
};

MongoModule.collection = function() {
    this.db.collection.apply( this, arguments );
};

module.exports = function( config ) {
    MongoModule.config = config;
    return MongoModule;
};

