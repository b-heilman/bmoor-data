var bmoor = require('bmoor'),
	Feed = require('./Feed.js'),
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

	filter( fn, settings ){
		var child = new Collection();

		if ( !settings ){
			settings = {};
		}

		child.parent = this;

		child.disconnect = this.subscribe({
			insert: function( datum ){
				if ( fn(datum) ){
					child.add( datum );
				}
			},
			remove: function( datum ){
				child.remove( datum );
			}
		});

		child.go = function(){
			var datum,
				insert,
				arr = this.parent.data;

			this.empty();

			if ( settings.pre ){
				settings.pre();
			}

			if ( this.hasWaiting('insert') ){
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

			if ( settings.post ){
				settings.post();
			}
		};

		child.go();

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
				pre: function(){
					ctx = settings.normalize();
				}
			}
		);
	}

	// settings { size }
	paginate( settings ){
		var child = new Collection(),
			origSize = settings.size;

		child.parent = this;

		child.disconnect = this.subscribe({
			insert: function( datum ){
				child.add( datum );

				// TODO : debounce
			},
			remove: function( datum ){
				child.remove( datum );

				// TODO : debounce
			}
		});

		child.go = function(){
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
		};

		child.nav = {
			pos: settings.start || 0,
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

		child.go();

		return child;
	}

	index( fn ){
		var i, c,
			d,
			disconnect,
			index = {};

		for( i = 0, c = this.data.length; i < c; i++ ){
			d = this.data[i];

			index[ fn(d) ] = d;
		}

		disconnect = this.subscribe({
			insert: function( ins ){
				index[ fn(ins) ] = ins;
			},
			remove: function( outs ){
				delete index[ fn(outs) ];
			}
		});

		return {
			get: function( dex ){
				return index[ dex ];
			},
			keys: function(){
				return Object.keys( index );
			},
			disconnect: function(){
				disconnect();
			}
		};
	}

	route( hasher ){
		var i, c,
			old = {},
			index = {},
			disconnect;

		function get( i ){
			var t = index[i];

			if ( !t ){
				t = new Collection();
				index[i] = t;
			}

			return t;
		}

		function add( datum ){
			var i = hasher( datum );

			old[ setUid(datum) ] = i;

			get(i).add( datum );
		}

		function remove( datum ){
			var dex = setUid(datum);

			if ( dex in old ){
				get( old[dex] ).remove( datum );
			}
		}

		for( i = 0, c = this.data.length; i < c; i++ ){
			add( this.data[i] );
		}

		disconnect = this.subscribe({
			insert: function( ins ){
				add( ins );
			},
			remove: function( outs ){
				remove( outs );
			}
		});

		return {
			get: function( hash ){
				return get( hash );
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
}

module.exports = Collection;
