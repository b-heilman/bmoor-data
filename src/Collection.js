var bmoor = require('bmoor'),
	Feed = require('./Feed.js'),
	Hash = require('./object/Hash.js'),
	setUid = bmoor.data.setUid;

function testStack( old, fn ){
	if ( old ){
		return function( massaged, ctx ){
			if ( fn(massaged,ctx) ){
				return true;
			}else{
				return old(massaged,ctx);
			}
		};
	}else{
		return fn;
	}
}

class Collection extends Feed {

	remove( datum ){
		var dex = this.data.indexOf( datum );
		
		if ( dex !== -1 ){
			this.data.splice( dex, 1 );

			this.trigger( 'remove', datum );

			this.trigger('update');
		}
	}

	empty(){
		var arr = this.data;

		if ( this.hasWaiting('remove') ){
			for ( let i = 0, c = arr.length; i < c; i++ ){
				this.trigger( 'remove', arr[i] );
			}
		}

		this.trigger('update');

		arr.length = 0;
	}

	getChild( subscribe ){
		var child = new (this.constructor)();

		child.parent = this;

		if ( subscribe !== false ){
			if ( !subscribe ){
				subscribe = {};
			}

			child.disconnect = this.subscribe({
				insert: subscribe.insert ? 
					subscribe.insert.bind(child) : 
					function( datum ){
						child.add( datum );
					},
				remove: subscribe.remove ?
					subscribe.remove.bind(child) :
					function( datum ){
						child.remove( datum );
					},
				process: subscribe.process ?
					subscribe.process.bind(child) : 
					function(){
						child.go();
					}
			});
		}

		return child;
	}

	filter( fn, settings ){
		var child = this.getChild({
				insert: function( datum ){
					if ( fn(datum) ){
						child.add( datum );
					}
				}
			});

		if ( !settings ){
			settings = {};
		}

		child.go = bmoor.flow.window(function(){
			var datum,
				insert,
				arr = this.parent.data;

			this.empty();

			if ( settings.before ){
				settings.before();
			}

			if ( this.hasWaiting('insert') ){ // performance optimization
				insert = ( datum ) => {
					Array.prototype.push.call( this.data, datum );
					this.trigger( 'insert', datum );
				};
			}else{
				insert = ( datum ) => {
					Array.prototype.push.call( this.data, datum );
				};
			}

			for ( let i = 0, c = arr.length; i < c; i++ ){
				datum = arr[i];
				if ( fn(datum) ){
					insert(datum);
				}
			}

			if ( settings.after ){
				settings.after();
			}

			child.trigger('process');
		}, 5, 30, { context: child });

		child.go.flush();

		return child;
	}

	search( settings ){
		var ctx,
			test;

		for( let i = settings.tests.length - 1; i !== -1; i-- ){
			test = testStack( test, settings.tests[i] );
		}

		return this.filter(
			function( datum ){
				if ( !datum.$massaged ){
					datum.$massaged = settings.massage(datum);
				}

				return test(datum.$massaged, ctx);
			},
			{
				before: function(){
					ctx = settings.normalize();
				}
			}
		);
	}

	// settings { size }
	paginate( settings ){
		var child = this.getChild({
				insert: function( datum ){
					child.add( datum );

					child.go();
				},
				remove: function( datum ){
					child.remove( datum );

					child.go();
				},
				process: function(){
					child.go();
				}
			}),
			origSize = settings.size;

		child.go = bmoor.flow.window(function(){
			var span = settings.size,
				length = this.parent.data.length,
				steps = Math.ceil( length / span );

			this.nav.span = span;
			this.nav.steps = steps;
			this.nav.count = length;

			let start = this.nav.pos * span,
				stop = start + span;

			this.nav.start = start;
			this.nav.stop = stop;

			this.empty();

			for( let i = start; i < stop && i < length; i++ ){
				this.add( this.parent.data[i] );
			}

			child.trigger('process');
		}, 5, 30, { context: child });

		child.nav = {
			pos: settings.start || 0,
			goto: function( pos ){
				this.pos = pos;
				child.go.flush();
			},
			hasNext: function(){
				return this.stop < this.count;
			},
			next: function(){
				this.pos++;
				child.go.flush();
			},
			hasPrev: function(){
				return !!this.start;
			},
			prev: function(){
				this.pos--;
				child.go.flush();
			},
			setSize: function( size ){
				settings.size = size;
			},
			maxSize: function(){
				settings.size = child.parent.data.length;
			},
			resetSize: function(){
				settings.size = origSize;
			}
		};

		child.go.flush();

		return child;
	}

	_index( dex ){
		var index = {};

		for( let i = 0, c = this.data.length; i < c; i++ ){
			let d = this.data[i],
				key = dex.go(d);

			index[ key ] = d;
		}

		let disconnect = this.subscribe({
			insert: function( ins ){
				index[ dex.go(ins) ] = ins;
			},
			remove: function( outs ){
				delete index[ dex.go(outs) ];
			}
		});

		return {
			get: function( search ){
				var key = dex.go(search);
				return index[ key ];
			},
			keys: function(){
				return Object.keys( index );
			},
			disconnect: function(){
				disconnect();
			}
		};
	}

	index( search, settings ){
		var index,
			dex = new Hash( search, settings );

		if ( !this.indexes ){
			this.indexes = {};
		}

		index = this.indexes[dex.hash];

		if ( !index ){
			index = this._index( dex );
			this.indexes[dex.hash] = index;
		}

		return index;
	}

	get( search, settings ){
		this.index( search, settings ).get( search );
	}

	_route( dex ){
		let old = {},
			index = {},
			get = ( key ) => {
				var collection = index[key];

				if ( !collection ){
					collection = this.getChild( false );
					index[key] = collection;
				}

				return collection;
			};

		function add( datum ){
			var d = dex.go( datum );

			old[ setUid(datum) ] = d;

			get(d).add( datum );
		}

		function remove( datum ){
			var dex = setUid(datum);

			if ( dex in old ){
				get( old[dex] ).remove( datum );
			}
		}

		for( let i = 0, c = this.data.length; i < c; i++ ){
			add( this.data[i] );
		}

		let disconnect = this.subscribe({
			insert: function( datum ){
				add( datum );
			},
			remove: function( datum ){
				remove( datum );
			}
		});

		return {
			get: function( search ){
				return get( dex.go(search) );
			},
			reroute: function( datum ){
				remove( datum );
				add( datum );
			},
			keys: function(){
				return Object.keys( index );
			},
			disconnect: function(){
				disconnect();
			}
		};
	}

	route( search, settings ){
		var router,
			dex = new Hash(search,settings);

		if ( !this.routes ){
			this.routes = {};
		}

		router = this.routes[dex.hash];

		if ( !router ){
			router = this._route( dex );

			this.routes[dex.hash] = router;
		}

		return router;
	}
}

module.exports = Collection;
