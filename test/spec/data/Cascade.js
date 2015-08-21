describe('bmoor.data.Cascade', function(){
	var Cascade,
		Test;

	beforeEach(bMoor.test.injector(
		['bmoor.data.Cascade',
		function( C ){
			Cascade = C;
		}]
	));

	it('should be defined', function(){
		expect( Cascade ).toBeDefined();
	});

	describe('general functionality', function(){
		var cascade,
			obj;

		beforeEach(function(){
			cascade = new Cascade(['foo','bar']);

			cascade.$insert({
				foo: 0,
				bar: 0,
				value: 0
			});

			obj = {
				foo: 0,
				bar: 1,
				value: 1
			};
			cascade.$insert( obj );

			cascade.$insert({
				foo: 1,
				bar: 0,
				value: 10
			});

			cascade.$insert({
				foo: 1,
				bar: 1,
				value: 100
			});
		});

		it('should set attributes based on node values', function(){
			expect( cascade[0] ).toBeDefined();
			expect( cascade[1] ).toBeDefined();
			expect( cascade[2] ).toBeUndefined();
		});

		it('should allow you to find nodes', function(){
			var t = cascade.find( 0, 1 );
			expect( t instanceof Cascade ).toBe( true );
			expect( t.getNodes() ).toEqual( [obj] );
		});

		it('should allow you to build a grid', function(){
			var grid = cascade.getGrid(function( nodes ){
				return {
					value: nodes[0].value
				};
			});

			expect( grid.$array.length ).toBe( 4 );
			expect( grid.get(0,0).value ).toBe( 0 );
			expect( grid.get(0,1).value ).toBe( 1 );
			expect( grid.get(1,0).value ).toBe( 10 );
			expect( grid.get(1,1).value ).toBe( 100 );
		});
	});
});