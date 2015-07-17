describe('bmoor.data.collection.Filterable', function(){
	var Test,
		Filter,
		arr;

	beforeEach(bMoor.test.injector(
		['bmoor.data.Collection','bmoor.data.collection.Filterable', 
		function( Collection, F ){
			Filter = F;
			Test = bMoor.test.make({
				construct: function( filter ){
					if ( filter ){
						this.$filter = filter;
					}
				},
				parent: Collection,
				extend: [
					new F(function( d ){
						return d.value > 5;
					})
				]
			}),
			arr = new Test();
		}]
	));

	it('should override _canInsert', function(){
		var f = new Filter(),
			t = {};

		expect( Filter.prototype._canInsert ).toBeDefined();
		expect( f._canInsert ).toBeDefined();

		f._$extend( t );

		expect( t._canInsert ).toBeDefined();
	});

	it('should be defined', function(){
		expect( arr.$filter ).toBeDefined();
	});

	describe('construction', function(){
		it('should allow push elements onto the array when push, remove as well pass filter', function(){
			var t = { value : 6 };

			arr.push( t );

			expect( arr[0] ).toBe( t );

			arr.$remove( t );

			expect( arr.length ).toBe( 0 );
		});

		it('should not push elements onto the array when push, remove as well that don\'t pass filter', function(){
			var t = { value : 3 };

			arr.push( t );

			expect( arr.length ).toBe( 0 );

			arr.$remove( t );

			expect( arr.length ).toBe( 0 );
		});

		it('should allow for parents to be set up', function(){
			var t1 = { value : 6 },
				t2 = { value : 3 },
				sibling = new Test( function( d ){ return d.value > 5; } ),
				parent = new Test( function( d ){ return true; } );
			
			parent.$follow( arr );
			parent.$follow( sibling );

			arr.push( t1 );
			sibling.push( t2 );

			expect( sibling.length ).toBe( 0 );
			expect( parent.length ).toBe( 1 );
			expect( arr.length ).toBe( 1 );

			expect( arr[0] ).toBe( t1 );
			expect( parent[0] ).toBe( t1 );
		});
	});
});