;(function(){
/** bmoor-data v0.0.1 **/
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
				_canInsert: function(){
					return true;
				},
				_insert : function( content ){
					bMoor.data.setUid( content );

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
				$watch: function( onInsert, onRemove ){
					var	ins = this.$on('insert', onInsert ), 
						rem = this.$on('remove', onRemove );

					return function(){
						ins();
						rem();
					};
				},
				$follow: function( collection ){
					var i, c,
						dis = this,
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
						dis = this,
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
	function( Decorator, Regulator ){
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
						this.$sort = new Regulator( 5, 200, function( inst ){
							if ( inst.$sorter ){
								inst.sort( inst.$sorter );
							}
						});
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