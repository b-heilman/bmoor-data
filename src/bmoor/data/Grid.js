bMoor.make( 'bmoor.data.Grid', 
	[
	function(){
		'use strict';
		
		function DataGrid(){
			this.$array = [];
			this.$dex = {};
			this.$rows = 0;
			this.$cols = 0;
		}

		return  {
			construct : DataGrid,
			// TODO : make this eventful
			properties : {
				setIndexes: function( primary, secondary ){
					this.primary = primary;
					this.secondary = secondary;
				},
				byRow: function( fn, processFactory ){
					var t,
						i, c,
						j, co,
						proc,
						stats,
						res = [];

					for( i = 0, c = this.$rows; i < c; i++ ){
						stats = {};

						for( j = 0, co = this.$cols; j < co; j++ ){
							t = this.get( i, j );
							if ( t ){
								fn.call( stats, t, j );
							}
						}

						if ( processFactory ){
							proc = processFactory( stats );
							for( j = 0, co = this.$cols; j < co; j++ ){
								t = this._get( i, j );
								if ( t ){
									proc( t.datum, t );
								}
							}
						}

						res.push( stats );
					}

					return res;
				},
				byColumn: function( fn, processFactory ){
					var t,
						i, c,
						j, co,
						proc,
						stats,
						res = [];

					for( i = 0, c = this.$cols; i < c; i++ ){
						stats = {};

						for( j = 0, co = this.$rows; j < co; j++ ){
							t = this.get( j, i );
							if ( t ){
								fn.call( stats, t, j );
							}
						}

						if ( processFactory ){
							proc = processFactory( stats );
							for( j = 0, co = this.$rows; j < co; j++ ){
								t = this._get( j, i );
								if ( t ){
									proc( t.datum, t );
								}
							}
						}
						res.push( stats );
					}

					return res;
				},
				all: function( fn, processFactory ){
					var t,
						i, c,
						j, co,
						proc,
						stats = {};

					for( i = 0, c = this.$rows; i < c; i++ ){
						for( j = 0, co = this.$cols; j < co; j++ ){
							t = this.get( i, j );
							if ( t ){
								fn.call( stats, t, i, j );
							}
						}
					}

					if ( processFactory ){
						proc = processFactory( stats );
						for( i = 0, c = this.$rows; i < c; i++ ){
							for( j = 0, co = this.$cols; j < co; j++ ){
								t = this._get( i, j );
								if ( t ){
									proc( t.datum, t );
								}
							}
						}
					}

					return stats;
				},
				_get: function( row, col ){
					var t = this.$dex[ row ];

					if ( t ){
						return t[ col ];
					}
				},
				get: function( row, col ){
					var t = this._get( row, col );

					if ( t ){
						return t.datum;
					}
				},
				toArray: function(){
					var res = [],
						row,
						i, c,
						j, co,
						t;

					for( i = 0, c = this.$rows; i < c; i++ ){
						row = [];
						res.push( row ); 

						for( j = 0, co = this.$cols; j < co; j++ ){
							row.push( this.get(i,j) );
						}
					}

					return res;
				},
				join: function( dataGrid ){
					bMoor.loop( dataGrid.$array, function( point ){
						this.$insert( point.row, point.col, point.datum );
					}, this);
				},
				$insert: function( row, col, dataNode ){
					var t, 
						d;

					row = parseInt( row, 10 );
					col = parseInt( col, 10 );

					if ( !this.$rows || this.$rows <= row ){
						this.$rows = row+1;
					}

					if ( !this.$cols || this.$cols <= col ){
						this.$cols = col+1;
					}

					t = this.$dex[ row ];

					if ( !t ){
						t = this.$dex[ row ] = {};
					}
					
					d = t[col];

					if ( d ){
						d.datum = dataNode;
					}else{
						d = t[col] = {
							row: row,
							col: col,
							datum: dataNode
						};

						this.$array.push( d );
					}
				},
				$remove: function( dataNode ){
					// TODO
				}
			}
		};
	}]
);