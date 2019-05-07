const bmoor = require('bmoor'),
	setUid = bmoor.data.setUid;

module.exports = {
	fn: function route( dex, parent ){
		let old = null;
		let index = {};

		const get = key => {
			var collection = index[key];

			if ( !collection ){
				collection = parent.makeChild({}, function(){
					// I don't want the children to do anything
					// the parent will copy data down
				});
				index[key] = collection;
			}

			return collection;
		};

		function add(datum){
			var d = dex.go(datum);

			old[setUid(datum)] = d;

			get(d).add( datum );
		}

		function remove(datum){
			var dex = setUid(datum);

			if ( dex in old ){
				get(old[dex]).remove( datum );
			}
		}

		function makeRouter(){
			old = {};

			for (let k in index){
				index[k].empty();
			}

			for(let i = 0, c = parent.data.length; i < c; i++ ){
				add(parent.data[i]);
			}
		}
		
		makeRouter();

		let disconnect = parent.subscribe({
			next: makeRouter
		});

		return {
			get: function( search ){
				return get(dex.parse(search));
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
};
