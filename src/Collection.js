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
	indexOf(obj, start){
		return this.data.indexOf(obj, start);
	}

	//--- collection methods
	_track( datum ){
		if (datum.on){
			datum.on[this.$$bmoorUid] = datum.on(
				'update',
				() => {
					this.go();
				}
			);
		}
	}

	_remove( datum ){
		var dex = this.indexOf(datum);
		
		if ( dex !== -1 ){
			let rtn = this.data[dex];

			if ( dex === 0 ){
				this.data.shift();
			}else{
				this.data.splice( dex, 1 );
			}

			if (datum.on){
				let fn = datum.on[this.$$bmoorUid];

				if(fn){
					fn();
					datum.on[this.$$bmoorUid] = null;
				}
			}
			
			return rtn;
		}
	}

	remove( datum ){
		var rtn = this._remove(datum);

		if (rtn){
			this.next();

			return rtn;
		}
	}

	empty(){
		var arr = this.data;

		while (arr.length){
			this._remove(arr[0]);
		}

		this.next();
	}

	makeChild(settings, goFn){
		const ChildClass = (settings ? 
				settings.childClass : null) || this.constructor;
		const child = new (ChildClass)(null, settings);

		child.parent = this;

		if (goFn){
			child.go = goFn;
		}

		child.follow(this, settings);

		return child;
	}

	index( search, settings ){
		return memorized( 
			this,
			'indexes', 
			search instanceof Hash ? search : new Hash(search, settings),
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
			search instanceof Hash ? search : new Hash(search, settings),
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
			search instanceof Test ? search : new Test(search, settings),
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

		const hash = settings.hash || 'search:'+Date.now();

		return this._filter(
			function( datum ){
				if ( !datum.$normalized ){
					datum.$normalized = {};
				}

				let cache = datum.$normalized[hash];
				if (!cache){
					cache = settings.normalizeDatum(datum);
					datum.$normalized[hash] = cache;
				}

				return test(cache, ctx);
			},
			Object.assign(settings,{
				before: function(){
					ctx = settings.normalizeContext();
				},
				hash
			})
		);
	}

	// settings { size }
	paginate( settings ){
		let child = null;

		const parent = this;
		const origSize = settings.size;

		const nav = {
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

		child = this.makeChild(settings, function(){
			var span = settings.size,
				length = parent.data.length,
				steps = Math.ceil( length / span );

			nav.span = span;
			nav.steps = steps;
			nav.count = length;

			const start = nav.pos * span;
			let stop = start + span;

			nav.start = start;
			if ( stop > length ){
				stop = length;
			}
			nav.stop = stop;

			this.empty();

			for( let i = start; i < stop; i++ ){
				this.add( this.parent.data[i] );
			}

			this.next();
		});
		
		child.nav = nav;

		return child;
	}
}

module.exports = Collection;
