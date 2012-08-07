module.exports = {
    getIndex: function( cb ) {
        console.log( this.db );
        this.db.collection( 'pages', function( err, pages ) {
            if ( err ) throw err;
            pages.find( {}, {
                'limit': 10,
                'sort': 'title'
            } ).toArray( function( err, pagesFound ) {
                if ( err ) throw err;
                cb( pagesFound )
            });
        });
    },

    getById: function( pid, cb ) {
        this.db.collection( 'pages', function( err, pages ) {
            if ( err ) throw err;
            pages.findOne( { _id: pid },
                function( err, page ) {
                if ( err ) throw err;
                cb( page );
            });
        });
    },

    save: function( body, cb ) {
        this.db.collection( 'pages', function( err, pages ) {
            if ( err ) throw err;
            pages.save( body, { safe: true },
                function( err, status ) {
                if ( err ) throw err;
                if ( status ) {
                    cb( status );
                }
            });
        });
    },

    'delete': function( pid, cb ) {
        this.db.collection( 'pages', function( err, pages ) {
            pages.remove( { _id: pid },
                function( err, removed ) {
                if ( err ) throw err;
                cb( removed );
            });
        });
    }
};

