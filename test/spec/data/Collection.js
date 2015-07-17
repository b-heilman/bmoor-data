describe('bmoor.data.Collection', function(){
	var Collection;

	beforeEach(bMoor.test.injector(
		['bmoor.data.Collection', function( C ){
			Collection = C;
		}]
	));

	it('should be defined', function(){
		expect( Collection ).toBeDefined();
	});

	it('should properly initiate everything', function(){
		var arr = new Collection( 'one','two' );

		expect( arr.length ).toBe( 2 );
	});

	it('should properly initiate everything', function(){
		var arr = new Collection();

		expect( arr.length ).toBe( 0 );
	});

	describe('events', function(){
		it('should allow for insert updates to be listened for', function(){
			var arr = new Collection(),
				t = {},
				res;

			arr.$on('insert', function( v ){
				res = v;
			});

			arr.$insert(t);

			expect( t ).toBe( res );
		});

		it('should allow for remove updates to be listened for', function(){
			var arr = new Collection(),
				t = {},
				res;

			arr.$on('remove', function( v ){
				res = v;
			});

			arr.$insert(t);
			arr.$remove(t);

			expect( t ).toBe( res );
		});

		it('should simplify with $watch', function(){
			var arr = new Collection(),
				t = {},
				insert,
				remove;

			arr.$watch(
				function( v ){
					insert = v;
				},
				function( v ){
					remove = v;
				}
			);

			arr.$insert(t);
			arr.$remove(t);

			expect( insert ).toBe( t );
			expect( remove ).toBe( t );
		});
	});

	describe('construction', function(){
		var arr;

		beforeEach(function(){
			arr = new Collection();
		});

		it('should push elements onto the array when push, remove as well', function(){
			var t = {};

			arr.$insert( t );

			expect( arr[0] ).toBe( t );

			arr.$remove( t );

			expect( arr.length ).toBe( 0 );
		});

		it('should allow for parents to be set up', function(){
			var t1 = {},
				t2 = {},
				sibling = new Collection(),
				parent = new Collection();

			parent.$follow( arr );
			arr.push( t1 );

			sibling.push( t2 );
			parent.$follow( sibling );

			expect( parent[0] ).toBe( t1 );
			expect( parent[1] ).toBe( t2 );
			expect( arr[0] ).toBe( t1 );
			expect( sibling[0] ).toBe( t2 );
		});
	});
});