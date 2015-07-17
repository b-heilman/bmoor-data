describe('bmoor.data.collection.Sortable', function(){
	var Test,
		Timeout,
		arr;

	beforeEach(bMoor.test.injector(
		['bmock.flow.Timeout', 'bmoor.data.Collection','bmoor.data.collection.Sortable', 
		function( T, Collection, S ){
			Timeout = T;
			Test = bMoor.test.make({
				construct: function( sorter ){
					if ( sorter ){
						this.$sorter = sorter;
					}
				},
				parent: Collection,
				extend: [
					new S(function( a, b ){
						return a.x - b.x;
					})
				]
			}),
			arr = new Test();
		}],
		{
			'bmock.flow.Timeout': 'bmoor.flow.Timeout'
		}
	));

	it('should be defined', function(){
		expect( arr.$sorter ).toBeDefined();
	});

	describe('construction', function(){
		it('should allow push elements onto the array when push, remove as well pass filter', function(){
			var t = { value : 6 };

			arr.push( t );

			expect( arr[0] ).toBe( t );

			arr.$remove( t );

			expect( arr.length ).toBe( 0 );
		});

		it('should sort the list after insertion, by after a delay', function(){
			var t0 = { x : 3 },
				t1 = { x : 2 },
				t2 = { x : 4 };

			arr.push( t0 );
			arr.push( t1 );
			arr.push( t2 );

			expect( arr[0] ).toBe( t0 );
			expect( arr[1] ).toBe( t1 );
			expect( arr[2] ).toBe( t2 );

			Timeout.tick(20);

			expect( arr[0] ).toBe( t1 );
			expect( arr[1] ).toBe( t0 );
			expect( arr[2] ).toBe( t2 );
		});
	});
});