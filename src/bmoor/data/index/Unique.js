bMoor.make( 'bmoor.data.index.Unique', 
	[ 'bmoor.data.Index',
	function( Index ){
		'use strict';

		return {
			parent : Index,
			construct : function( fields ){
				Index.call( this, fields );
			},
			properties : {
				select : function( obj ){
					return this._collections[ this.hash(obj) ];
				},
				_insert: function( index, group, obj ){
					this._collections[ index ] = obj; 
				},
				_remove: function( odex, obj ){
					this._collections[ odex ] = undefined;
				}
			}
		};
	}]
);