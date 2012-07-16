module.exports = {
    home: function( req, res ) {
        res.redirect( '/pages', 301 );
    },

    index: function( req, res ) {
        this.model.getIndex( function( pages ) {
            res.render( 'pages/index', {
                pages: pages
            });
        });
    },

    createForm: function( req, res ) {
        can.bind( this )( 'create', req.session.uid,
            function() {
            res.render( 'pages/create' );
        });
    },

    read: function( req, res ) {
        this.model.getById( req.params.pid,
            function( page ) {
            res.render( 'pages/page', {
                page: page
            });
        });
    },

    updateForm: function( req, res ) {
        can.bind( this )( 'edit', req.session.uid,
            function() {
            this.model.getById( req.params.pid,
                function( page ) {
                res.render( 'pages/edit', {
                    page: page
                });
            });
        });
    },

    deleteForm: function( req, res ) {
        can.bind( this )( 'delete', req.session.uid,
            function() {
            this.model.getById( req.params.pid,
                function( page ) {
                res.render( 'pages/delete', {
                    page: page
                });
            });
        });
    },

    create: function( req, res ) {
        can.bind( this )( 'create', req.session.uid,
            function() {
            this.model.save( req.body, function( status ) {
                res.render( 'pages/create', {
                    message: status
                });
            });
        });
    },

    update: function( req, res ) {
        can.bind( this )( 'update', req.session.uid,
            function() {
            this.model.save( req.body, function( status ) {
                res.render( 'pages/edit', {
                    message: status
                });
            });
        });
    },

    'delete': function( req, res ) {
        can.bind( this )( 'delete', req.session.uid,
            function() {
            this.model.delete( req.params.pid, function( status ) {
                res.render( 'index', {
                    message: 'Page ' + req.params.pid + ' deleted.'
                });
            });
        });
    }
};

function can( permission, uid, callback ) {
    this.model.can( permission, uid, function( can ) {
        if ( can ) {
            callback();
        }
        else {
            res.render( 'error', {
                status: 401,
                message: 'Unauthorized'
            });
        }
    });
}

