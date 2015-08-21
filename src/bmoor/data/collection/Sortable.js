bMoor.make( 'bmoor.data.collection.Sortable',
	[ 'bmoor.extender.Decorator','bmoor.flow.Regulator', 
	function( Decorator, regulator ){
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
						this.$sort = regulator(function( inst ){
							if ( inst.$sorter ){
								inst.sort( inst.$sorter );
							}
						}, 10, 200 );
					}

					this.$sort( this );

					return this.$old( group );
				}
			}
		};
	}]
);