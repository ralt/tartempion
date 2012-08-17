var path = require( 'path' );

module.exports = function( app ) {
    // Load the helpers file
    var helpers = require(
        path.join( process.cwd(), 'helpers', 'helpers.js' )
    );

    // First take care of the helpers
    app.helpers( helpers.helpers );

    // Then the dynamicHelpers
    app.dynamicHelpers( helpers.dynamicHelpers );

    console.log( 'Helpers loaded.' );
};

