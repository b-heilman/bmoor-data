var bmoor = require('bmoor'),
	Feed = require('./Feed.js'),
	Hash = require('./object/Hash.js'),
	Test = require('./object/Test.js'),
	route = require('../lib/router.js').fn,
	index = require('../lib/indexer.js').fn,
	filter = require('../lib/filter.js').fn,
	sorted = require('../lib/sorter.js').fn,
	mapped = require('../lib/mapper.js').fn,
	testStack = require('../lib/fnStack.js').test,
	memorized = require('../lib/cache.js').memorized;

class Collection extends Feed {

	//--- array methods
	indexOf( obj, start ){
		return this.data.indexOf( obj, start );
	}

	//--- collection methods
	_add( datum ){
		if ( this.settings.follow && datum.on ){
			datum.on[this.$$bmoorUid] = 
				datum.on('update', this.settings.follow);
		}

		return super._add( datum );
	}

	_remove( datum ){
		var dex = this.indexOf( datum );
		
		if ( dex !== -1 ){
			let rtn = this.data[dex];

			if ( dex === 0 ){
				this.data.shift();
			}else{
				this.data.splice( dex, 1 );
			}

			if ( this.settings.follow && datum.on ){
				datum.on[this.$$bmoorUid]();
			}
			
			return rtn;
		}
	}

	remove( datum ){
		var rtn = this._remove(datum);

		if ( rtn ){
			this.trigger('remove', rtn);

			this.ready();

			return rtn;
		}
	}

	empty(){
		var arr = this.data;

		while ( arr.length ){
			let d = arr[0];

			this._remove( d );
			this.trigger( 'remove', d );
		}

		this.ready();
	}

	follow( parent, settings ){
		var disconnect = parent.subscribe(Object.assign(
			{
				insert: ( datum ) => {
					this.add( datum );
				},
				remove: ( datum ) => {
					this.remove( datum );
				},
				process: () => {
					this.go();
				},
				destroy: () => {
					this.destroy();
				}
			},
			settings
		));

		if ( this.disconnect ){
			let old = this.disconnect;
			this.disconnect = function(){
				old();
				disconnect();
			};
		}else{
			this.disconnect = disconnect;
		}

		// if you just want to disconnect from this one
		// you can later be specific
		return disconnect; 
	}

	makeChild( settings ){
		let ChildClass = (settings ? 
				settings.childClass : null) || this.constructor,
			child = new (ChildClass)( settings );

		child.parent = this;

		if ( settings !== false ){
			child.follow( this, settings );
			let done = child.disconnect;

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
			index,
			settings
		);
	}

	get( search, settings ){
		return this.index( search, settings ).get( search );
	}

	//--- child generators
	route( search, settings ){
		return memorized(
			this,
			'routes',
			search instanceof Hash ? search : new Hash( search, settings ),
			route,
			settings
		);
	}

	// TODO : create the Compare class, then memorize this
	sorted( sortFn, settings ){
		return memorized(
			this,
			'sorts',
			{
				hash: sortFn.toString(),
				go: sortFn
			},
			sorted,
			settings
		);
	}

	map( mapFn, settings ){
		return memorized(
			this,
			'maps',
			{
				hash: mapFn.toString(),
				go: mapFn
			},
			mapped,
			settings
		);
	}

	_filter( search, settings ){
		return memorized(
			this,
			'filters',
			search instanceof Test ? search : new Test( search, settings ),
			filter,
			settings
		);
	}

	filter( search, settings ){
		return this._filter(search, settings);
	}

	// TODO::migration search -> select
	search( settings ){
		console.warn('Collection::search, will be removed soon');
		return this.select( settings );
	}

	select( settings ){
		var ctx,
			test;

		for( let i = settings.tests.length - 1; i !== -1; i-- ){
			test = testStack( test, settings.tests[i] );
		}

		return this._filter(
			function( datum ){
				if ( !datum.$normalized ){
					datum.$normalized = settings.normalizeDatum(datum);
				}

				return test(datum.$normalized, ctx);
			},
			Object.assign(settings,{
				before: function(){
					ctx = settings.normalizeContext();
				},
				hash: 'search:'+Date.now(),
			})
		);
	}

	// settings { size }
	paginate( settings ){
		var child,
			parent = this;

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

		child = this.makeChild( settings );

		let origSize = settings.size;

		child.go = bmoor.flow.window(function(){
			var span = settings.size,
				length = parent.data.length,
				steps = Math.ceil( length / span );

			this.nav.span = span;
			this.nav.steps = steps;
			this.nav.count = length;

			let start = this.nav.pos * span,
				stop = start + span;

			this.nav.start = start;
			if ( stop > length ){
				stop = length;
			}
			this.nav.stop = stop;

			this.empty();

			for( let i = start; i < stop; i++ ){
				this.add( this.parent.data[i] );
			}

			child.trigger('process');
		}, settings.min||5, settings.max||30, { context: child });

		let nav = {
			pos: settings.start || 0,
			goto: function( pos ){
				if ( bmoor.isObject(pos) ){
					var tPos = parent.data.indexOf(pos);

					if ( tPos === -1 ){
						pos = 0;
					}else{
						pos = Math.floor(tPos/settings.size);
					}
				}

				if ( pos < 0 ){
					pos = 0;
				}

				if ( pos !== this.pos ){
					this.pos = pos;
					child.go();
				}
			},
			hasNext: function(){
				return this.stop < this.count;
			},
			next: function(){
				this.goto( this.pos + 1 );
			},
			hasPrev: function(){
				return !!this.start;
			},
			prev: function(){
				this.goto( this.pos - 1 );
			},
			setSize: function( size ){
				this.pos = -1;
				settings.size = size;
				this.goto( 0 );
			},
			maxSize: function(){
				this.setSize( child.parent.data.length );
			},
			resetSize: function(){
				this.setSize( origSize );
			}
		};

		child.nav = nav;
		child.go.flush();

		return child;
	}
}

module.exports = Collection;
