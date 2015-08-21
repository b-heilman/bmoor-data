bMoor.make( 'bmoor.data.Follower', 
	['bmoor.extender.Mixin',
	function( Mixin ){
		return {
			parent: Mixin,
			properties: {
				$follow: function( collection ){
					var i, c,
						follow;

					follow = bMoor.data.getUid( collection );

					if ( !this.$$following ){
						this.$$following = {};
					}

					if ( !this.$$following[follow] ){
						for( i = 0, c = collection.length; i < c; i++ ){
							this.$insert( collection[i] );
						}

						this.$$following[follow] = collection.$watch(
							this.$insert.bind(this),
							this.$remove.bind(this)
						);
					}
				},
				$ignore: function( collection ){
					var i, c,
						follow;

					follow = bMoor.data.getUid( collection );

					if ( this.$$following && !this.$$following[follow] ){
						for( i = 0, c = collection.length; i < c; i++ ){
							this.$remove( collection[i] );
						}

						this.$$following[follow]();
						this.$$following[follow] = null;
					}
				}
			}
		};
	}]
);