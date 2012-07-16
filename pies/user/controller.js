module.exports = {
    index: function( req, res ) {
        this.model.getIndex( function( users ) {
            res.render( 'users/index', {
                users: users
            });
        });
    },

    read: function( req, res ) {
        this.model.getById( req.params.uid, function( user ) {
            res.render( 'users/read', {
                user: user
            });
        });
    }
};
