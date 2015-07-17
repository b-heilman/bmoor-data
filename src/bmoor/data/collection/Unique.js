bMoor.make( 'bmoor.data.collection.Unique', 
	[ 'bmoor.extender.Decorator', 'bmoor.data.Collection',
	function( Decorator, Collection ){
		'use strict';
		
		return  {
			parent : Decorator,
			properties : {
				_canInsert : function( content ){
					var t = bMoor.data.setUid( content );
					
					if ( !this._$memory ){
						this._$memory = {};
					}

					if ( this._$memory[t] ){
						this._$memory[t]++;
						return false;
					}else if ( this.$old(content) ) {
						this._$memory[t] = 1;
						return true;
					}
				},
				_canRemove : function( content ){
					var t = bMoor.data.getUid( content );

					if ( !this._$memory ){
						this._$memory = {};
					}

					this._$memory[t]--;
					
					return this.$old(content) && !(this._$memory[t]);
				}
			}
		};
	}]
);