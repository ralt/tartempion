module.exports = {
    getIndex: function( cb ) {
        console.log( this.db );
        this.db.collection( 'pages', function( err, pages ) {
            pages.find( {}, {
                'limit': 10,
                'sort': 'title'
            } ).toArray( function( err, pages ) {
                if ( err ) throw err;
                cb( pages )
            });
        });
    },

    getById: function( pid, cb ) {
        this.db.pages.findOne( { _id: pid },
            function( err, page ) {
            if ( err ) throw err;
            cb( page );
        });
    },

    save: function( body, cb ) {
        this.db.pages.save( body, { safe: true },
            function( err, status ) {
            if ( err ) throw err;
            if ( status ) {
                cb( status );
            }
        });
    },

    'delete': function( pid, cb ) {
        this.db.pages.remove( { _id: pid },
            function( err, removed ) {
            if ( err ) throw err;
            cb( removed );
        });
    }
};

