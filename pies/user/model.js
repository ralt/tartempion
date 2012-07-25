module.exports = {
    getIndex: function( cb ) {
        this.db.users.find( {}, {
            'limit': 10,
            'sort': 'name'
        } ).toArray( function( err, users ) {
            if ( err ) throw err;
            cb( users );
        });
    },

    getById: function( uid, cb ) {
        this.db.users.findOne( { _id: pid },
            function( err, user ) {
            if ( err ) throw err;
            cb( user ) ;
        });
    }
};
