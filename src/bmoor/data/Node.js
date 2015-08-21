bMoor.make( 'bmoor.data.Node', 
	['bmoor.data.Eventable',
	function( Eventable ){
		function isSubset( parent, child ){
			var i, c,
				keys;

			keys = Object.keys( child );

			for( i = 0, c = keys.length; i < c; i++ ){
				if ( !parent[keys[i]] ){
					return false;
				}
			}

			return true;
		}

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
				$update: function( change, value ){
					var update;

					try{
						if ( value ){
							bMoor.set( change, value, this.getData() );
							update = change;
						}else {
							if ( bMoor.isFunction(change) ){
								update = change( this.getData() );
							}else if ( bMoor.isObject(change) ){
								if ( !change.$$explodable && isSubset(this.getData(),change) ){
									bMoor.object.merge( this.getData(), change );
									update = change;
								}else{
									bMoor.object.explode( this.getData(), change );
									update = bMoor.object.explode( change );
								}
							}else{
								update = this.getData();
							}
						}

						// right now, the value passed is pretty much useless
						this._update( update );
					}catch( ex ){
						// TODO : error handling
						console.log( 'bmoor.Node:update', ex );
					}
				},
				$watch: function( cb, ctx, args ){
					if ( ctx ){
						return this.$on( 'update', function(){
							return cb.apply( ctx, args||arguments );
						});
					}else{
						return this.$on( 'update', cb );
					}
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