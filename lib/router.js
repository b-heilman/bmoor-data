const bmoor = require('bmoor'),
	setUid = bmoor.data.setUid;

module.exports = {
	fn: function route( dex, parent ){
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
				return get( dex.parse(search) );
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
