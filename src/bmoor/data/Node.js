bMoor.make( 'bmoor.data.Node', 
	['bmoor.data.Eventable',
	function( Eventable ){
		return {
			construct: function( targ ){
				this.getData = function(){
					return targ;
				};
			},
			extend: [
				new Eventable()
			],
			properties: {
				_update: function( update ){
					this.$trigger( 'update', update );
				},
				update: function( change, value ){
					var update;

					try{
						if ( value ){
							bMoor.set( change, value, this.getData() );
							update = change;
						}else {
							if ( bMoor.isFunction(change) ){
								update = change( this.getData() );
							}else if ( bMoor.isObject(change) ){
								bMoor.object.explode( change,  this.getData() );
								update = bMoor.object.explode( change );
							}
						}

						this._update( update );
					}catch( ex ){
						// TODO : error handling
						console.log( 'bmoor.Node:update', ex );
					}
				},
				watch: function( cb ){
					return this.$on('update', cb );
				},
				mount: function( path, node ){
					bMoor.set( path, node, this.getData() );

					/*
					TODO: do I care?

					if ( !this.$$children ){
						this.$$children = [];
					}
					
					this.$$children.push();

					return function clear$mount(){
						bMoor.array.remove( this.$$children[event], node );
					};
					*/
				}
			}
		};
	}]
);