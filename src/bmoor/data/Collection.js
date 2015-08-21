bMoor.make( 'bmoor.data.Collection', 
	[ 'bmoor.defer.Group', 'bmoor.data.Eventable', 'bmoor.data.Follower',
	function( Defer, Eventable, Follower ){
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
				new Eventable(),
				new Follower()
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