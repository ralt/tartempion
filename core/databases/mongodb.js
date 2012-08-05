var mongodb = require( 'mongodb' ),
    Server = mongodb.Server,
    Db = mongodb.Db;

var MongoModule = function( config ) {
    this.config = config;
};

MongoModule.setup = function() {
    // Initialize the db connection
    this.db = new Db( this.config.databaseName,
        new Server(
            this.config.serverConfig.address,
            this.config.serverConfig.port,
            this.config.options
        ),
        this.config.options
    );

    this.db.open( function( err, database ) {
        if ( err ) throw err;
        console.log( 'Database driver loaded.' );
    });
};

MongoModule.collection = function() {
    this.db.collection.call( this, arguments );
};

module.exports = MongoModule;

