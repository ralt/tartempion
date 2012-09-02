'use strict';

var path = require( 'path' );

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

    addToNcore: function( pies, constructor ) {
        var ncore = require( 'ncore' );

        // Create an ncore instance and add the modules
        ncore.constructor( constructor );

        Object.keys( pies ).forEach( function( pie ) {
            // For each pie, add the model and the controller
            // But first, get the path:
            var piePath = path.join( process.cwd(), 'pies', pies[ pie ].path );
            ncore.add( pie + "Controller", require(
                path.join( piePath, 'controller.js' )
            ));
            ncore.add( pie + "Model", require(
                path.join( piePath, 'model.js' )
            ));
        });

        console.log( 'Pies loaded.' );

        return ncore;
    }
};

