;(function(){
/** bmoor-data v0.0.1 **/
bMoor.make( 'bmoor.data.Bucket', 
	['bmoor.data.Cascade',
	function( Cascade ){
		'use strict';
		
		function DataBucket( buckets, getValue ){
			this.$cascade = new Cascade( buckets );
			this._getValue = getValue;
		}

		return  {
			construct : DataBucket,
			properties : {
				getCascade: function( values ){
					return this.$cascade.find( values );
				},
				getGrid: function( values ){
					return this.getCascade().getGrid(function( nodes, bucket ){
						return {
							value: bucket.$value,
							nodes: nodes
						};
					});
				},
				$insert: function( dataNode ){
					var v = this._getValue( dataNode ),
						bucket = this.$cascade.$insert( dataNode );

					while( bucket ){
						if ( !bucket.$value ){
							bucket.$value = v;
						}else{
							bucket.$value += v;
						}
						bucket = bucket.getParent();
					}
				},
				$remove: function( dataNode ){
					var v = this._getValue( dataNode ),
						bucket = this.$cascade.$remove( dataNode );

					while( bucket ){
						bucket.$value -= v;
						bucket = bucket.getParent();
					}
				},
				$update: function( from, to ){
					this.$remove( from );
					this.$insert( to );
				}
			}
		};
	}]
);
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
bMoor.make( 'bmoor.data.Collection', 
	[ 'bmoor.defer.Group', 'bmoor.data.Eventable',
	function( Defer, Eventable ){
		'use strict';
		
		function DataCollection(){
			var i, c;

			bMoor.data.setUid(this);

			for( i = 0, c = arguments.length; i < c; i++ ){
				this.$insert( arguments[i] );
			}			
		}

		return  {
			parent : Array,
			construct : DataCollection,
			extend: [
				new Eventable()
			],
			properties : {
				_canInsert: function( dataNode ){
					bMoor.data.setUid( dataNode );

					return true;
				},
				_insert : function( content ){
					this.$trigger( 'insert', content );
				},
				_canRemove: function(){
					return true;
				},
				_remove : function( content ){
					this.$trigger( 'remove', content );
				},
				concat : function(){
					var i, c, 
						t = new DataCollection();

					t.$follow( this );
					for( i = 0, c = arguments; i < c; i++ ){
						t.push( arguments[i] ); 
					}

					return t;
				},
				push : function( obj ){
					if ( obj instanceof DataCollection ){
						this.$follow(obj);
					} else if ( this._canInsert(obj) ) {
						Array.prototype.push.call( this, obj );
						this._insert(obj);
					}
				},
				unshift : function( obj ){
					if ( obj instanceof DataCollection ){
						this.$follow(obj);
					} else if ( this._canInsert(obj) ) {
						Array.prototype.unshift.call( this, obj );
						this._insert(obj);
					}
				},
				pop : function(){
					var t;

					if ( this._canRemove() ){
						t = Array.prototype.pop.call( this );
						this._remove( t );
					}

					return t;
				},
				shift : function(){
					var t = Array.prototype.shift.call( this );
					this._remove( t );
					
					return t;
				},
				slice : function(){
					var i, c,
						t = Array.prototype.slice.apply( this, arguments );

					for( i = 0, c = t.length; i < c; i++ ){
						this.$remove( t[i] );
					}

					return new Collection( t );
				},
				forEach : function( func, context ){
					var i, c;

					for( i = 0, c = this.length; i < c; i++ ){
						func.call( (context || this), this[i], i );
					}
				},
				toArray: function(){
					return Array.prototype.slice.call( this, 0 );
				},
				// TODO : other casters like toString, etc
				$get: function( pos ){
					return this[pos];
				},
				$insert : function( obj ){
					this.push( obj ); // implicitely calls _canInsert and _insert via push
				},
				$remove : function( obj ){
					if ( obj instanceof DataCollection ){
						this.$ignore( obj );
					} else if ( this._canRemove(obj) ) {
						bMoor.array.remove( this, obj );
						this._remove(obj);
					}
				},
				// TODO : replace feedInto
				$watch: function( onInsert, onRemove, ctx, args ){
					var	ins,
						rem;

					if ( ctx ){
						ins = this.$on('insert', function(){
							return onInsert.apply( ctx, args||arguments );
						});
						rem = this.$on('remove', function(){
							return onRemove.apply( ctx, args||arguments );
						});
					}else{
						ins = this.$on('insert', onInsert );
						rem = this.$on('remove', onRemove );
					}

					return function(){
						ins();
						rem();
					};
				},
				$follow: function( collection ){
					var i, c,
						follow;

					if ( collection instanceof DataCollection ){
						follow = bMoor.data.getUid( collection );

						if ( !this.$$following ){
							this.$$following = {};
						}

						if ( !this.$$following[follow] ){
							for( i = 0, c = collection.length; i < c; i++ ){
								this.$insert( collection[i] );
							}

							this.$$following[follow] = collection.$watch(
								this.$insert.bind(this),
								this.$remove.bind(this)
							);
						}
					}
				},
				$ignore: function( collection ){
					var i, c,
						follow;

					if ( collection instanceof DataCollection ){
						follow = bMoor.data.getUid( collection );

						if ( this.$$following && !this.$$following[follow] ){
							for( i = 0, c = collection.length; i < c; i++ ){
								this.$remove( collection[i] );
							}

							this.$$following[follow]();
							this.$$following[follow] = null;
						}
					}
				},
				$inflate : function(){
					var i, c,
						defer = new Defer();

					bMoor.loop( this, function( d, i ){
						if ( bMoor.isFunction(d.inflate) ){
							defer.add( d.inflate() );
						}
					});

					defer.run();
					return defer.promise.then(function(){
						return data;
					});
				},
				$deflate : function(){
					var i, c,
						res = [],
						defer = new Defer();

					bMoor.loop( this, function( d, i ){
						if ( bMoor.isFunction(d.deflate) ){
							defer.add(
								d.deflate().then(function( v ){
									res[i] = v;
								}) 
							);
						}else{
							res[i] = d;
						}
					});

					defer.run();
					return defer.promise.then(function(){
						return res;
					});
				}
			}
		};
	}]
);
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
bMoor.make( 'bmoor.data.Feed', 
	[ 'bmoor.data.Collection',
	function( Collection ){
		'use strict';
		
		function DataFeed( key, arr ){
			var dis;

			this.$key = key;
			this._index = {};

			// TODO : make this be off of arrayLike
			if ( arr ){
				arr.push = function( dataNode ){
					dis.$insert( dataNode );
					Array.prototype.push.apply( arr, arguments );
				};
			}else{
				arr = [];
			}

			Collection.apply( this, arr );		
		}

		return  {
			parent : Collection,
			construct : DataFeed,
			properties : {
				$register: function( consumer ){
					var w = this.$watch( 
							consumer.$insert,
							consumer.$remove,
							consumer
						),
						o = this.$on('update', 
							function( update ){
								consumer.$update( update.from, update.to );
							}
						);

					return function(){
						w();
						o();
					};
				},
				_canInsert: function( dataNode ){
					var dex = bMoor.get( this.$key, dataNode ),
						t = this._index[dex];

					if ( t ){
						// TODO : do I want to create an update / event data types?
						this.$trigger( 'update', {
							from: bMoor.object.override( {}, t ),
							to:  bMoor.object.override( t, dataNode )
						});
						return false;
					}else{
						bMoor.data.setUid( dataNode );
						return true;
					}
				}
			}
		};
	}]
);
bMoor.make( 'bmoor.data.Grid', 
	[
	function(){
		'use strict';
		
		function DataGrid(){
			this.$array = [];
			this.$dex = {};
			this.$rows = 0;
			this.$cols = 0;
		}

		return  {
			construct : DataGrid,
			// TODO : make this eventful
			properties : {
				setIndexes: function( primary, secondary ){
					this.primary = primary;
					this.secondary = secondary;
				},
				byRow: function( fn, processFactory ){
					var t,
						i, c,
						j, co,
						proc,
						stats,
						res = [];

					for( i = 0, c = this.$rows; i < c; i++ ){
						stats = {};

						for( j = 0, co = this.$cols; j < co; j++ ){
							t = this.get( i, j );
							if ( t ){
								fn.call( stats, t, j );
							}
						}

						if ( processFactory ){
							proc = processFactory( stats );
							for( j = 0, co = this.$cols; j < co; j++ ){
								t = this._get( i, j );
								if ( t ){
									proc( t.datum, t );
								}
							}
						}

						res.push( stats );
					}

					return res;
				},
				byColumn: function( fn, processFactory ){
					var t,
						i, c,
						j, co,
						proc,
						stats,
						res = [];

					for( i = 0, c = this.$cols; i < c; i++ ){
						stats = {};

						for( j = 0, co = this.$rows; j < co; j++ ){
							t = this.get( j, i );
							if ( t ){
								fn.call( stats, t, j );
							}
						}

						if ( processFactory ){
							proc = processFactory( stats );
							for( j = 0, co = this.$rows; j < co; j++ ){
								t = this._get( j, i );
								if ( t ){
									proc( t.datum, t );
								}
							}
						}
						res.push( stats );
					}

					return res;
				},
				all: function( fn, processFactory ){
					var t,
						i, c,
						j, co,
						proc,
						stats = {};

					for( i = 0, c = this.$rows; i < c; i++ ){
						for( j = 0, co = this.$cols; j < co; j++ ){
							t = this.get( i, j );
							if ( t ){
								fn.call( stats, t, i, j );
							}
						}
					}

					if ( processFactory ){
						proc = processFactory( stats );
						for( i = 0, c = this.$rows; i < c; i++ ){
							for( j = 0, co = this.$cols; j < co; j++ ){
								t = this._get( i, j );
								if ( t ){
									proc( t.datum, t );
								}
							}
						}
					}

					return stats;
				},
				_get: function( row, col ){
					var t = this.$dex[ row ];

					if ( t ){
						return t[ col ];
					}
				},
				get: function( row, col ){
					var t = this._get( row, col );

					if ( t ){
						return t.datum;
					}
				},
				toArray: function(){
					var res = [],
						row,
						i, c,
						j, co,
						t;

					for( i = 0, c = this.$rows; i < c; i++ ){
						row = [];
						res.push( row ); 

						for( j = 0, co = this.$cols; j < co; j++ ){
							row.push( this.get(i,j) );
						}
					}

					return res;
				},
				join: function( dataGrid ){
					bMoor.loop( dataGrid.$array, function( point ){
						this.$insert( point.row, point.col, point.datum );
					}, this);
				},
				$insert: function( row, col, dataNode ){
					var t, 
						d;

					row = parseInt( row, 10 );
					col = parseInt( col, 10 );

					if ( !this.$rows || this.$rows <= row ){
						this.$rows = row+1;
					}

					if ( !this.$cols || this.$cols <= col ){
						this.$cols = col+1;
					}

					t = this.$dex[ row ];

					if ( !t ){
						t = this.$dex[ row ] = {};
					}
					
					d = t[col];

					if ( d ){
						d.datum = dataNode;
					}else{
						d = t[col] = {
							row: row,
							col: col,
							datum: dataNode
						};

						this.$array.push( d );
					}
				},
				$remove: function( dataNode ){
					// TODO
				}
			}
		};
	}]
);
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
bMoor.make( 'bmoor.data.collection.Sortable',
	[ 'bmoor.extender.Decorator','bmoor.flow.Regulator', 
	function( Decorator, regulator ){
		return {
			parent : Decorator,
			construct: function( sorter ){
				this.$sorter = sorter;
			},
			properties : {
				_$extend: function( target ){
					if ( this.$sorter ){
						target.$sorter = this.$sorter;
					}

					Decorator.prototype._$extend.call( this, target );
				},
				_insert: function( group ){
					if ( !this.$sort ){
						this.$sort = regulator(function( inst ){
							if ( inst.$sorter ){
								inst.sort( inst.$sorter );
							}
						}, 10, 200 );
					}

					this.$sort( this );

					return this.$old( group );
				}
			}
		};
	}]
);
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
}());