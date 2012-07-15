module.exports = {
    getIndex: function( cb ) {
        cb( [
            {
                'name': 'User 1'
            },
            {
                'name': 'User 2'
            }
        ]);
    },

    getById: function( uid, cb ) {
        cb( {
            'name': 'User ' + uid
        });
    }
};
