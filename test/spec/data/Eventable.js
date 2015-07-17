describe('bmoor.data.Eventable', function(){
	var Eventable,
		Test;

	beforeEach(bMoor.test.injector(['bmoor.data.Eventable', function( E ){
		Eventable = E;
		Test = bMoor.test.make({
			extend: [
				new Eventable()
			]
		});
	}]));

	it('should be defined', function(){
		expect( Eventable ).toBeDefined();
	});

	it('should add $on and $listen to the prototype', function(){
		expect( Test.prototype.$on ).toBeDefined();
		expect( Test.prototype.$trigger ).toBeDefined();
	});

	describe('$on and $listen', function(){
		it('should allow passing data from $trigger to $on', function(){
			var t = new Test(),
				res = {},
				r1,
				r2;

			t.$on('test', function( v ){
				r1 = v;
			});

			t.$on('ping', function( v ){
				r2 = v;
			});

			t.$trigger('test', res );
			t.$trigger('ping', 1 );

			expect( r1 ).toBe( res );
			expect( r2 ).toBe( 1 );
		});

		it('should work with multiple calls', function(){
			var t = new Test(),
				res = {},
				r1,
				r2;

			t.$on('test', function( v ){
				r1 = v;
			});

			t.$on('test', function( v ){
				r2 = v;
			});

			t.$trigger('test', res );

			expect( r1 ).toBe( res );
			expect( r2 ).toBe( res );

			t.$trigger('test', 1 );

			expect( r1 ).toBe( 1 );
			expect( r2 ).toBe( 1 );
		});
	});
});