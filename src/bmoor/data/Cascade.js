bMoor.make( 'bmoor.data.Cascade', 
	[ 'bmoor.data.Grid',
	function( Grid ){
		'use strict';
		
		function DataCascade( buckets, parent ){
			var dis;

			this.$index = buckets[0];
			this.$secondary = buckets.slice(1);
			this.$nodes = {};

			this.getParent = function(){
				return parent;
			};
		}

		function invert( dex ){
			var t;

			if ( dex ){
				if ( bMoor.isArray(secondary) ){
					t = {};

					bMoor.loop( secondary, function( value, i ){
						t[ value ] = i;
					});

					dex = t;
				}
			}else{
				dex = { $count : 0 };
			}

			return dex;
		}

		function toArray( dex ){
			var res = [];

			bMoor.object.safe( dex, function( value, key ){
				res[value] = key;
			});

			return res;
		}

		return  {
			construct : DataCascade,
			properties : {
				_makeChild: function(){
					return new DataCascade( this.$secondary, this );
				},
				find: function( srch ){
					var next,
						s;

					if ( bMoor.isUndefined(arguments[0]) ){
						return this;
					}else if ( arguments.length > 1 || !bMoor.isArray(srch) ){
						srch = Array.prototype.slice.call( arguments, 0 );
					}

					s = srch.shift();
					next = this[s];

					if ( !bMoor.isUndefined(next) ){
						if ( srch.length ){
							return next.find( srch );
						}else{
							return next;
						}
					}
				},
				getNodes: function( nodeConvert ){
					return bMoor.object.values( this.$nodes );
				},
				_getGrid: function( index, row, nodeConvert ){
					var res = new Grid();

					if ( '$count' in index ){
						bMoor.object.naked( this, function( child, dex ){
							var pos = index[dex];

							if ( pos === undefined ){
								pos = index[dex] = index.$count++;
							}

							res.$insert( row, pos, nodeConvert(child.getNodes(),child) );
						});
					}else{
						bMoor.each( index, function( pos, dex ){
							var child = this[dex];

							if ( child ){
								res.$insert( row, pos, nodeConvert(child.getNodes(),child) );
							}
						}, this);
					}

					return res;
				},
				getGrid: function( primary, secondary, nodeConvert ){
					var res = new Grid(),
						t;

					if ( bMoor.isFunction(primary) ){
						nodeConvert = primary;
						primary = undefined;
						secondary = undefined;
					}

					primary = invert( primary );
					secondary = invert( secondary );
					
					if ( '$count' in primary ){
						bMoor.object.naked( this, function( child, dex ){
							var pos = primary[dex];

							if ( pos === undefined ){
								pos = primary[dex] = primary.$count++;
							}

							res.join( child._getGrid(secondary,pos,nodeConvert) );
						});
					}else{
						bMoor.each( index, function( pos, dex ){
							var child = this[dex];

							if ( child ){
								res.join( child._getGrid(secondary,pos,nodeConvert) );
							}
						}, this);
					}

					res.setIndexes( toArray(primary), toArray(secondary) );

					return res;
				},
				$insert: function( dataNode ){
					var uid = bMoor.data.setUid( dataNode ),
						dex,
						t;

					this.$nodes[uid] = dataNode;
					if ( this.$index ){
						dex = bMoor.get( this.$index, dataNode );
						t = this[dex];

						if ( !t ){
							t = this[dex] = this._makeChild();
						}

						return t.$insert( dataNode );
					}else{
						return this;
					}
				},
				$remove: function( dataNode ){
					var uid = bMoor.data.setUid( dataNode ),
						dex,
						t;

					if ( this.$nodes[uid] ){
						delete this.$nodes[uid];

						if ( this.$index ){
							dex = bMoor.get( this.$index, dataNode );
							t = this[dex];

							if ( t ){
								return t.$remove( dataNode );
							}							
						}else{
							return this;
						}
					}
				}
			}
		};
	}]
);