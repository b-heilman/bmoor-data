
var bmoor = require('bmoor'),
	Hash = require('./object/Hash.js'),
	Test = require('./object/Test.js'),
	routeFn = require('../lib/router.js').fn,
	indexFn = require('../lib/indexer.js').fn,
	filterFn = require('../lib/filter.js').fn,
	sortedFn = require('../lib/sorter.js').fn,
	mappedFn = require('../lib/mapper.js').fn,
	testStack = require('../lib/fnStack.js').test,
	memorized = require('../lib/cache.js').memorized;

// NOTE : this class is a temporary class that will be removed eventually
//   this is to support backwards compatibility, so I am creating it now, but 
//   will depricate immediately in next version

const {Feed} = require('./Feed.js');
const {Subject} = require('./Subject.js');

class Actionable extends Feed {

	constructor(parent, fn, settings = {}){
		super(null, settings);

		this.go = () => {
			this.data = fn(parent.data);

			this.publish();
		};

		this.setParent(parent.subscribe(this.go));
	}

	index( search, settings = {}){
		settings = Object.assign(settings, this.settings);

		return memorized( 
			this,
			'indexes', 
			search instanceof Hash ? search : new Hash(search, settings),
			indexFn,
			(fn) => {
				const rtn = new Subject();

				rtn.setParent(
					this.subscribe(data => {
						const dex = fn(data);

						rtn.data = dex;
						rtn.publish();
					})
				);

				return rtn;
			},
			settings
		);
	}

	//--- child generators
	route( search, settings = {}){
		settings = Object.assign(settings, this.settings);

		return memorized(
			this,
			'routes',
			search instanceof Hash ? search : new Hash(search, settings),
			function(dex, parent){
				return routeFn(dex, parent, function(){
					return new Feed();
				});
			},
			(fn) => {
				const rtn = new Subject();

				rtn.setParent(
					this.subscribe(data => {
						const dex = fn(data);

						rtn.data = dex;
						rtn.publish();
					})
				);

				return rtn;
			},
			settings
		);
	}

	// TODO : create the Compare class, then memorize this
	sorted( sortFn, settings = {}){
		settings = Object.assign(settings, this.settings);

		return memorized(
			this,
			'sorts',
			{
				hash: sortFn.toString(),
				go: sortFn
			},
			sortedFn,
			(fn) => new Actionable(this, fn, settings),
			settings
		);
	}

	map( mapFn, settings = {}){
		settings = Object.assign(settings, this.settings);

		return memorized(
			this,
			'maps',
			{
				hash: mapFn.toString(),
				go: mapFn
			},
			mappedFn,
			(fn) => new Actionable(this, fn, settings),
			settings
		);
	}

	_filter( search, settings = {}){
		settings = Object.assign(settings, this.settings);

		return memorized(
			this,
			'filters',
			search instanceof Test ? search : new Test(search, settings),
			filterFn,
			(fn) => new Actionable(this, fn, settings),
			settings
		);
	}

	filter( search, settings = {}){
		return this._filter(search, settings);
	}

	select( settings = {}){
		var ctx,
			test;

		for( let i = settings.tests.length - 1; i !== -1; i-- ){
			test = testStack(test, settings.tests[i]);
		}

		const hash = settings.hash || 'search:'+Date.now();

		settings = Object.assign(settings, this.settings);

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

	search( settings ){
		console.warn('Collection::search, will be removed soon');
		return this.select( settings );
	}

	// settings { size }
	paginate(settings = {}){
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

		child = new Feed();
		child.nav = nav;
		child.go = () => {
			const data = this.data;

			var span = settings.size,
				length = data.length,
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

			let inside = [];
			for( let i = start; i < stop; i++ ){
				inside.push(data[i]);
			}

			child.data = inside;
			child.publish();
		};

		this.subscribe(child.go);

		return child;
	}

	destroy(){
		this.disconnect();

		super.destroy();
	}
}

module.exports = {
	Actionable
};
