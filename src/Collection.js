var bmoor = require('bmoor'),
	Feed = require('./Feed.js'),
	setUid = bmoor.data.setUid;

class Collection extends Feed {

	remove( datum ){
		var dex = this.data.indexOf( datum );
		
		if ( dex !== -1 ){
			this.data.splice( dex, 1 );

			this.trigger( 'remove', datum );

			this.trigger( 'update' );
		}
	}

	filter( fn ){
		var i, c,
			d,
			src = [],
			child = new Collection( src );

		for( i = 0, c = this.data.length; i < c; i++ ){
			d = this.data[i];

			if ( fn(d) ){
				src.push( d );
			}
		}

		child.$parent = this;

		child.$disconnect = this.subscribe({
			insert: function( ins ){
				if ( fn(ins) ){
					child.add( ins );
				}
			},
			remove: function( outs ){
				child.remove( outs );
			}
		});

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
