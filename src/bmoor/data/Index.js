bMoor.make( 'bmoor.data.Index', 
	['bmoor.data.Collection', 'bmoor.data.Follower',
	function( Collection, Follower ){
		'use strict';

		function getKeys( arr ){
			if ( bMoor.isArray(arr) ){
				return arr.sort();
			}else{
				return Object.keys( arr ).sort();
			}
		}

		function makeName( arr ){
			return getKeys( arr ).join( '-' );
		}

		function CacheIndex( fields ){
			var get,
				hash,
				dex,
				func,
				flds;

			bMoor.data.getUid( this );

			try{
				if ( bMoor.isInjectable(fields) ){
					flds = fields.slice(0,-1);
					dex = 'func( obj.' + flds.slice(0).sort().join(', obj.') + ' )';
					func = fields[ fields.length-1 ];
					hash = new Function( 'obj', 'func', 'return '+dex+';' ); // jshint ignore:line
				}else{
					if ( !bMoor.isFunction(fields.join) ){
						fields = [ fields ];
					}

					flds = fields;
					dex = 'obj.'+flds.slice(0).sort().join('+"-"+obj.');
					hash = new Function( 'obj', 'return '+dex+';' ); // jshint ignore:line
				}
			}catch( ex ){
				throw 'could not generate index on: ' + JSON.stringify( fields );
			}

			this.hash = function( obj ){
				return hash( obj, func );
			};
			
			this.fields = flds;
			this.name = makeName( flds );
			this._hashes = {};
			this._collections = {};
		}

		return {
			construct: CacheIndex,
			extend: [
				new Follower()
			],
			statics: {
				makeName : makeName,
				getKeys : getKeys
			},
			properties: {
				_insert: function( index, group, obj ){
					if ( !group ){ 
						group = this._collections[ index ] = new Collection(); 
					}

					group.$insert( obj );
				},
				$insert : function( obj ){
					var i, c,
						index = this.hash( obj ),
						uid = bMoor.data.setUid( obj ),
						odex,
						group;

					if ( index !== undefined ){ // I'm allowing null as an index
						odex = this._hashes[uid];

						// this is for changes / updates
						if ( odex !== undefined ){
							if ( odex === index ){
								return index; // why, would you... just so save some processing
							}

							this._remove( odex, obj );
						}

						this._hashes[uid] = index;
						group = this._collections[ index ];

						this._insert( index, group, obj );
					}

					return index;
				},
				_remove: function( odex, obj ){
					var group = this._collections[ odex ];

					if ( group ){
						group.$remove( obj );
					}
				},
				$remove : function( obj ){
					var uid = bMoor.data.setUid( obj );

					this._remove( this._hashes[uid], obj );
					this._hashes[ uid ] = undefined;
				},
				select : function( obj ){
					var dex = this.hash( obj ),
						group = this._collections[ dex ];

					if ( !group ){ 
						group = this._collections[ dex ] = new Collection(); 
					}

					return group;
				},
				canFullfill : function( obj ){
					var i, c,
						fields = this.fields;

					for( i = 0, c = fields.length; i < c; i++ ){
						if ( obj[fields[i]] === undefined ){
							return false;
						}
					}

					return true;
				}
			}
		};
	}]
);