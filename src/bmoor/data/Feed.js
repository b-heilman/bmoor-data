bMoor.make( 'bmoor.data.Feed', 
	[ 'bmoor.data.Collection',
	function( Collection ){
		'use strict';
		
		function DataFeed( key, arr ){
			var dis;

			this.$key = key;
			this._index = {};

			// TODO : make this be off of arrayLike
			if ( arr ){
				arr.push = function( dataNode ){
					dis.$insert( dataNode );
					Array.prototype.push.apply( arr, arguments );
				};
			}else{
				arr = [];
			}

			Collection.apply( this, arr );		
		}

		return  {
			parent : Collection,
			construct : DataFeed,
			properties : {
				$register: function( consumer ){
					var w = this.$watch( 
							consumer.$insert,
							consumer.$remove,
							consumer
						),
						o = this.$on('update', 
							function( update ){
								consumer.$update( update.from, update.to );
							}
						);

					return function(){
						w();
						o();
					};
				},
				_canInsert: function( dataNode ){
					var dex = bMoor.get( this.$key, dataNode ),
						t = this._index[dex];

					if ( t ){
						// TODO : do I want to create an update / event data types?
						this.$trigger( 'update', {
							from: bMoor.object.override( {}, t ),
							to:  bMoor.object.override( t, dataNode )
						});
						return false;
					}else{
						bMoor.data.setUid( dataNode );
						return true;
					}
				}
			}
		};
	}]
);