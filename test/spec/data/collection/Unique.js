describe('bmoor.data.collection.Unique', function(){
	var Test,
		arr;

	beforeEach(bMoor.test.injector(
		['bmoor.data.Collection','bmoor.data.collection.Unique', 
		function( Collection, U ){
			Test = bMoor.test.make({
				parent: Collection,
				extend: [
					new U()
				]
			}),
			arr = new Test();
		}]
	));

	describe('construction', function(){
		it('should allow push elements onto the array when push, remove as well pass filter', function(){
			var t = { value : 6 },
				t2 = { value : 6 };

			arr.push( t );

			expect( arr[0] ).toBe( t );

			arr.$remove( t );

			expect( arr.length ).toBe( 0 );

			arr.push( t );
			arr.push( t );
			arr.push( t2 );

			expect( arr.length ).toBe( 2 );
		});
	});
});