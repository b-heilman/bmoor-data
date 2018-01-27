var bmoor = require('bmoor'),
	Feed = require('./Feed.js'),
	Hash = require('./object/Hash.js'),
	Test = require('./object/Test.js'),
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

function memorized( parent, cache, expressor, generator, settings ){
	var rtn,
		index,
		oldDisconnect;

	if ( !parent[cache] ){
		parent[cache] = {};
	}

	index = parent[cache];

	// console.log( '->', expressor.hash );
	rtn = index[expressor.hash];

	if ( !rtn ){
		if ( !settings ){
			settings = {};
		}

		if ( settings.disconnect ){
			oldDisconnect = settings.disconnect;
		}

		settings.disconnect = function(){
			if ( oldDisconnect ){
				oldDisconnect();
			}

			index[expressor.hash] = null;
		};

		rtn = generator( expressor, parent, settings );

		index[expressor.hash] = rtn;
	}

	return rtn;
}

function route( dex, parent ){
	let old = {},
		index = {},
		get = ( key ) => {
			var collection = index[key];

			if ( !collection ){
				collection = parent.getChild( false );
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

	for( let i = 0, c = parent.data.length; i < c; i++ ){
		add( parent.data[i] );
	}

	let disconnect = parent.subscribe({
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

function index( dex, parent ){
	var index = {};

	for( let i = 0, c = parent.data.length; i < c; i++ ){
		let datum = parent.data[i],
			key = dex.go(datum);

		index[ key ] = datum;
	}

	let disconnect = parent.subscribe({
		insert: function( datum ){
			var key = dex.go(datum);
			index[ key ] = datum;
		},
		remove: function( datum ){
			var key = dex.go(datum);
			delete index[ key ];
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

function filter( dex, parent, settings ){
	var child;

	settings = Object.assign(
		{}, 
		{
			insert: function( datum ){
				if ( dex.go(datum) ){
					child.add( datum );
				}
			}
		},
		settings
	);

	child = parent.getChild( settings );

	child.go = bmoor.flow.window(function(){
		var datum,
			insert,
			arr = parent.data;

		child.empty();

		if ( settings.before ){
			settings.before();
		}

		if ( child.hasWaiting('insert') ){ // performance optimization
			insert = ( datum ) => {
				Array.prototype.push.call( child.data, datum );
				child.trigger( 'insert', datum );
			};
		}else{
			insert = ( datum ) => {
				Array.prototype.push.call( child.data, datum );
			};
		}

		for ( let i = 0, c = arr.length; i < c; i++ ){
			datum = arr[i];
			if ( dex.go(datum) ){
				insert(datum);
			}
		}

		if ( settings.after ){
			settings.after();
		}

		child.trigger('process');
	}, settings.min||5, settings.max||30);

	child.go.flush();

	return child;
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

	getChild( settings ){
		var child = new (this.constructor)( null, settings );

		child.parent = this;

		if ( settings !== false ){
			let done = this.subscribe(Object.assign(
				{
					insert: function( datum ){
						child.add( datum );
					},
					remove: function( datum ){
						child.remove( datum );
					},
					process: function(){
						child.go();
					},
					destroy: function(){
						child.destroy();
					}
				},
				settings
			));

			child.disconnect = function(){
				if ( settings.disconnect ){
					settings.disconnect();
				}

				done();
			};

			child.destroy = function(){
				child.disconnect();

				child.trigger('destroy');
			};
		}

		return child;
	}

	index( search, settings ){
		return memorized( 
			this,
			'indexes', 
			search instanceof Hash ? search : new Hash( search, settings ),
			index
		);
	}

	get( search, settings ){
		this.index( search, settings ).get( search );
	}

	route( search, settings ){
		return memorized(
			this,
			'routes',
			search instanceof Hash ? search : new Hash( search, settings ),
			route
		);
	}

	filter( search, settings ){
		return memorized(
			this,
			'filters',
			search instanceof Test ? search : new Test( search, settings ),
			filter,
			settings
		);
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
				},
				hash: 'search:'+Date.now()
			}
		);
	}

	// settings { size }
	paginate( settings ){
		var child;

		settings = Object.assign(
			{},
			{
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
			},
			settings
		);

		child = this.getChild( settings );

		let origSize = settings.size;

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
		}, settings.min||5, settings.max||30, { context: child });

		child.nav = {
			pos: settings.start || 0,
			goto: function( pos ){
				this.pos = pos;
				child.go();
			},
			hasNext: function(){
				return this.stop < this.count;
			},
			next: function(){
				this.pos++;
				child.go();
			},
			hasPrev: function(){
				return !!this.start;
			},
			prev: function(){
				this.pos--;
				child.go();
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
}

module.exports = Collection;
