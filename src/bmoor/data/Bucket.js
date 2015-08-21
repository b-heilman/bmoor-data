bMoor.make( 'bmoor.data.Bucket', 
	['bmoor.data.Cascade',
	function( Cascade ){
		'use strict';
		
		function DataBucket( buckets, getValue ){
			this.$cascade = new Cascade( buckets );
			this._getValue = getValue;
		}

		return  {
			construct : DataBucket,
			properties : {
				getCascade: function( values ){
					return this.$cascade.find( values );
				},
				getGrid: function( values ){
					return this.getCascade().getGrid(function( nodes, bucket ){
						return {
							value: bucket.$value,
							nodes: nodes
						};
					});
				},
				$insert: function( dataNode ){
					var v = this._getValue( dataNode ),
						bucket = this.$cascade.$insert( dataNode );

					while( bucket ){
						if ( !bucket.$value ){
							bucket.$value = v;
						}else{
							bucket.$value += v;
						}
						bucket = bucket.getParent();
					}
				},
				$remove: function( dataNode ){
					var v = this._getValue( dataNode ),
						bucket = this.$cascade.$remove( dataNode );

					while( bucket ){
						bucket.$value -= v;
						bucket = bucket.getParent();
					}
				},
				$update: function( from, to ){
					this.$remove( from );
					this.$insert( to );
				}
			}
		};
	}]
);