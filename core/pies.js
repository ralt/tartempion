module.exports = {
    loadConstructor: function( pies ) {
        var deps = {};

        // Inject each model into the controller
        Object.keys( pies ).forEach( function( pie ) {
            deps[ pie + "Controller" ] = {
                "model": pie + "Model"
            };
            // Inject each pie's dependency in the pie (controller and model)
            if ( 'dependencies' in pies[ pie ] ) {
                pies[ pie ].dependencies.forEach( function( dep ) {
                    deps[ pie + "Controller" ][ dep ] = dep + "Controller";
                });
            }
        });

        // And return the constructor
        return deps;
    },
};

