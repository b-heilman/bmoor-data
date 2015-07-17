bMoor.make( 'bmoor.data.Eventable', 
	['bmoor.extender.Mixin',
	function( Mixin ){
		return {
			parent: Mixin,
			properties: {
				$on : function( event, cb ){
					if ( !this._$listeners ){
						this._$listeners = {};
					}

					if ( !this._$listeners[event] ){
						this._$listeners[event] = [];
					}

					this._$listeners[event].push( cb );

					return function clear$on(){
						bMoor.array.remove( this.$$listeners[event], cb );
					};
				},
				$trigger: function( event, arg ){
					var listeners,
						i, c;

					if ( this._$listeners ){
						listeners = this._$listeners[event];

						if ( listeners ){
							for( i = 0, c = listeners.length; i < c; i++ ){
								listeners[i]( arg );
							}
						}					
					}
				}
			}
		};
	}]
);