bMoor.make( 'bmoor.data.collection.Filterable',
	[ 'bmoor.extender.Decorator',
	function( Decorator ){
		'use strict';
		
		return {
			parent : Decorator,
			construct: function( filter ){
				this.$filter = filter;
			},
			properties : {
				_$extend: function( target ){
					if ( this.$filter ){
						target.$filter = this.$filter;
					}

					Decorator.prototype._$extend.call( this, target );
				},
				_canInsert : function( obj ){
					if ( this.$filter(obj) ){
						return this.$old( obj );
					}
				}
			}
		};
	}]
);