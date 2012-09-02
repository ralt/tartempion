'use strict';

Array.prototype.antiDiff = function( arr ) {
    return arr.map( function( v ) {
        if ( !!~this.indexOf( v ) ) return v;
    }, this ).filter( Boolean )[ 0 ];
};

Object.merge = function () {
    return [].reduce.call( arguments, function ( ret, merger ) {
        Object.keys( merger ).forEach(function ( key ) {
            ret[ key ] = merger[ key ];
        });
        return ret;
    }, {} );
};

