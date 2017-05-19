var bmoor = require('bmoor'),
	Eventing = bmoor.Eventing,
	getUid = bmoor.data.getUid,
	makeGetter = bmoor.makeGetter,
	Mapper = require('bmoor-schema').Mapper;

class Pool extends Eventing {

	constructor(){
		super();

		bmoor.data.setUid(this);

		this.data = [];
		this.feeds = {};
		this.index = {};
	}

	addFeed( feed, index, readings ){
		var dex = makeGetter( index ),
			uid = getUid( feed ),
			data = this.data,
			dexs = this.index,
			mapper = ( new Mapper(readings) ).go,
			lastRead = 0,
			trigger = this.trigger.bind(this);

		function read( datum ){
			var i = dex( datum ), // identity
				d = dexs[i];

			if ( !d ){
				d = dexs[i] = {
					_ : i
				};
				data.push( d );
			}

			mapper( d, datum );
		}

		function readAll( changes ){
			var i, c;

			if( changes && changes.length ){
				for( i = lastRead, c = changes.length; i < c; i++ ){
					read( changes[i] );
				}

				trigger('update');
			}
		}

		if ( !this.feeds[uid] ){
			readAll();

			this.feeds[uid] = feed.on( 'insert', readAll );
		}
	}
}

module.exports = Pool;