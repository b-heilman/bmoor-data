bMoor.make( 'bmoor.data.collection.Sortable',
	[ 'bmoor.extender.Decorator','bmoor.flow.Regulator', 
	function( Decorator, Regulator ){
		return {
			parent : Decorator,
			construct: function( sorter ){
				this.$sorter = sorter;
			},
			properties : {
				_$extend: function( target ){
					if ( this.$sorter ){
						target.$sorter = this.$sorter;
					}

					Decorator.prototype._$extend.call( this, target );
				},
				_insert: function( group ){
					if ( !this.$sort ){
						this.$sort = new Regulator( 5, 200, function( inst ){
							if ( inst.$sorter ){
								inst.sort( inst.$sorter );
							}
						});
					}

					this.$sort( this );

					return this.$old( group );
				}
			}
		};
	}]
);