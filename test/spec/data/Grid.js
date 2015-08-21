describe('bmoor.data.Grid', function(){
	var Grid;

	beforeEach(bMoor.test.injector(
		['bmoor.data.Grid',
		function( G ){
			Grid = G;
		}]
	));

	it('should be defined', function(){
		expect( Grid ).toBeDefined();
	});

	describe('basic functionality', function(){
		var grid,
			dn1,
			dn2;

		beforeEach(function(){
			grid = new Grid();
			dn1 = {
				value: 1
			};
			dn2 = {
				value: 100
			};

			grid.$insert( 0, 0, dn1 );
			grid.$insert( 1, 1, dn2 );
		});

		it('should allow for insertion and toArray conversion', function(){
			expect( grid.toArray() ).toEqual( [[dn1,undefined],[undefined,dn2]] );
		});

		it('should allow getting a data point', function(){
			expect( grid.get(0,0) ).toEqual( dn1 );
		});

		it('should allow one Grid to join another', function(){
			var t = new Grid();

			t.$insert( 0, 0, 101 );
			t.$insert( 0, 1, 80085 );

			t.join( grid );

			expect( t.toArray() ).toEqual( [[dn1,80085],[undefined,dn2]] );
			expect( t.$array ).not.toBe( grid.$array );
		});
	});

	describe('grouping algorithms',function(){
		var grid;

		beforeEach(function(){
			grid = new Grid();

			grid.$insert( 0, 0, {
				value: 0
			});
			grid.$insert( 0, 1, {
				value: 1
			});
			grid.$insert( 1, 0, {
				value: 10
			});
			grid.$insert( 1, 1, {
				value: 100
			});
		});

		it('should allow processing all', function(){
			var t = grid.all(
				function( d ){
					var v = d.value;

					if ( this.min === undefined || this.min > v ){
						this.min = v;
					}

					if ( this.max === undefined || this.max < v ){
						this.max = v;
					}
				},
				function( stats ){
					var min = stats.min,
						max = stats.max - min;

					return function( d, node ){
						node.scale = (d.value - min) / max;
					};
				}
			);

			expect( t.min ).toBe( 0 );
			expect( t.max ).toBe( 100 );

			expect( grid._get(0,0).scale ).toBe( 0 );
			expect( grid._get(0,1).scale ).toBe( .01 );
			expect( grid._get(1,0).scale ).toBe( .1 );
			expect( grid._get(1,1).scale ).toBe( 1 );
		});

		it('should allow processing by row', function(){
			var t = grid.byRow(
				function( d ){
					var v = d.value;

					if ( this.min === undefined || this.min > v ){
						this.min = v;
					}

					if ( this.max === undefined || this.max < v ){
						this.max = v;
					}
				},
				function( stats ){
					var min = stats.min,
						max = stats.max - min;

					return function( d, node ){
						node.scale = (d.value - min) / max;
					};
				}
			);

			expect( t.length ).toBe( 2 );
			expect( t[0].min ).toBe( 0 );
			expect( t[0].max ).toBe( 1 );
			expect( t[1].min ).toBe( 10 );
			expect( t[1].max ).toBe( 100 );

			expect( grid._get(0,0).scale ).toBe( 0 );
			expect( grid._get(0,1).scale ).toBe( 1 );
			expect( grid._get(1,0).scale ).toBe( 0 );
			expect( grid._get(1,1).scale ).toBe( 1 );
		});

		it('should allow processing by column', function(){
			var t = grid.byColumn(
				function( d ){
					var v = d.value;

					if ( this.min === undefined || this.min > v ){
						this.min = v;
					}

					if ( this.max === undefined || this.max < v ){
						this.max = v;
					}
				},
				function( stats ){
					var min = stats.min,
						max = stats.max - min;

					return function( d, node ){
						node.scale = (d.value - min) / max;
					};
				});

			expect( t.length ).toBe( 2 );
			expect( t[0].min ).toBe( 0 );
			expect( t[0].max ).toBe( 10 );
			expect( t[1].min ).toBe( 1 );
			expect( t[1].max ).toBe( 100 );

			expect( grid._get(0,0).scale ).toBe( 0 );
			expect( grid._get(1,0).scale ).toBe( 1 );
			expect( grid._get(0,1).scale ).toBe( 0 );
			expect( grid._get(1,1).scale ).toBe( 1 );
		});
	});
});