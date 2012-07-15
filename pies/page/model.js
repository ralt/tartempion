module.exports = {
    can: function( permission, uid, cb ) {
        cb( true );
    },

    getIndex: function( cb ) {
        cb( [
            {
                'title': 'Title 1',
                'body': 'Body 1'
            },
            {
                'title': 'Title 2',
                'body': 'Body 2'
            }
        ]);
    },

    getById: function( pid, cb ) {
        cb( {
            'title': 'Title ' + pid,
            'body': 'Body ' + pid
        });
    },

    save: function( body, cb ) {
        cb( 'Save completed: ' + pid );
    },

    'delete': function( pid, cb ) {
        cb( 'Delete completed: ' + pid );
    }
};

