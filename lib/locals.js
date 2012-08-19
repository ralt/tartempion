var path = require( 'path' );

module.exports = function( app ) {
    // Load the locals file
    var locals = require(
        path.join( process.cwd(), 'locals', 'locals.js' )
    );

    // First take care of the helpers
    app.locals( locals.locals );

    console.log( 'Locals loaded.' );
};

