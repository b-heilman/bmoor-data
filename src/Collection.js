var bmoor = require('bmoor'),
	Feed = require('./Feed.js'),
	setUid = bmoor.data.setUid;

class Collection extends Feed {

	constructor( src ){
		super( src );

		this._removing = null;
		this.on('update', () => {
			this._removing = null;
		});
	}

	remove( datum ){
		var dex = this.data.indexOf( datum );
		
		if ( dex !== -1 ){
			this.data.splice( dex, 1 );

			if ( this.hasWaiting('remove') ){
				if ( this._removing === null ){
					this._removing = [ datum ];

					this.trigger( 'remove', this._removing );
				}else{
					this._removing.push( datum );
				}
			}

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
				// this will force an insert event to be fired
				// TODO : Do I want that?
				src.push( d );
			}
		}

		child.$parent = this;

		this.next( 'update', () => {
			child.$disconnect = this.subscribe({
				insert: function( ins ){
					var i, c,
						d;

					for( i = 0, c = ins.length; i < c; i++ ){
						d = ins[ i ];
						if ( fn(d) ){
							child.add( d );
						}
					}
				},
				remove: function( outs ){
					var i, c;

					for( i = 0, c = outs.length; i < c; i++ ){
						child.remove( outs[i] );
					}
				}
			});
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

		this.next( 'update', () => {
			disconnect = this.subscribe({
				insert: function( ins ){
					var i, c,
						d;

					for( i = 0, c = ins.length; i < c; i++ ){
						d = ins[i];
						index[ fn(d) ] = d;
					}
				},
				remove: function( outs ){
					var i, c;

					for( i = 0, c = outs.length; i < c; i++ ){
						delete index[ fn(outs[i]) ];
					}
				}
			});
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

		this.next( 'update', () => {
			disconnect = this.subscribe({
				insert: function( ins ){
					var i, c;

					for( i = 0, c = ins.length; i < c; i++ ){
						add( ins[i] );
					}
				},
				remove: function( outs ){
					var i, c;

					for( i = 0, c = outs.length; i < c; i++ ){
						remove( outs[i] );
					}
				}
			});
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
