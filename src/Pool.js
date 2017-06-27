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

			trigger('update');
		}

		if ( !this.feeds[uid] ){
			this.feeds[uid] = feed.on( 'insert', read );
		}
	}
}

module.exports = Pool;