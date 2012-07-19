module.exports = {
    requireLogin: function( req, res ) {
        if ( req.session.uid ) {
            next();
        }
        else {
            res.redirect( '/login' );
        }
    }
};

