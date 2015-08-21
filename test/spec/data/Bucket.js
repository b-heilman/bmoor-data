describe('bmoor.data.Bucket', function(){
	var Bucket;

	beforeEach(bMoor.test.injector(
		['bmoor.data.Bucket',
		function( C ){
			Bucket = C;
		}]
	));

	it('should be defined', function(){
		expect( Bucket ).toBeDefined();
	});

	describe('general functionality', function(){
		var bucket,
			obj;

		beforeEach(function(){
			bucket = new Bucket(
				['foo','bar','woot'],
				function( d ){
					return d.value;
				}
			);

			bucket.$insert({
				foo: 0,
				bar: 0,
				woot: 0,
				value: 0
			});

			obj = {
				foo: 0,
				bar: 1,
				woot: 0,
				value: 1
			};
			bucket.$insert( obj );

			bucket.$insert({
				foo: 1,
				bar: 0,
				woot: 0,
				value: 10
			});

			bucket.$insert({
				foo: 1,
				bar: 1,
				woot: 0,
				value: 100
			});

			bucket.$insert({
				foo: 1,
				bar: 1,
				woot: 1,
				value: 2
			});

			bucket.$insert({
				foo: 1,
				bar: 1,
				woot: 2,
				value: 4
			});

			bucket.$insert({
				foo: 1,
				bar: 1,
				woot: 3,
				value: 8
			});
		});

		it('should allow you to build a grid', function(){
			var grid = bucket.getGrid();

			expect( grid.get(0,0).value ).toBe( 0 );
			expect( grid.get(0,1).value ).toBe( 1 );
			expect( grid.get(0,1).nodes[0] ).toBe( obj );
			expect( grid.get(1,0).value ).toBe( 10 );
			expect( grid.get(1,1).value ).toBe( 114 );
		});
	});
});