module.exports = {
    /**
     * http://expressjs.com/guide.html#app.helpers()
     */
    helpers: {
        renderScriptsTags: function( scripts ) {
            if ( all ) {
                return scripts.map( function( script ) {
                    return '<script src="' + script + '"></script>';
                }).join( '\n' );
            }
            else {
                return '';
            }
        }
    },

    /**
     * http://expressjs.com/guide.html#app.dynamichelpers()
     */
    dynamicHelpers: {
        scripts: function( req, res ) {
            return [
                '//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'
            ];
        }
    }
};

