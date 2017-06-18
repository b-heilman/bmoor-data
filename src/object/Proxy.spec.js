describe('bmoor-data.object.Proxy', function(){
	var Proxy = bmoorData.object.Proxy;

	it('should be defined', function(){
		expect( Proxy ).toBeDefined();
	});

	describe('masks', function(){
		it('should obfuscate values correctly', function(){
			var target = {
					first: 1
				},
				proxy = new Proxy( target ),
				mask = proxy.getMask();

			mask.second = 2;

			expect( mask.first ).toBe( 1 );
			expect( mask.second ).toBe( 2 );
		});

		it('should copy value over from a seed', function(){
			var target = {
					first: 1
				},
				proxy = new Proxy( target ),
				seed = { foo: 'bar' },
				mask = proxy.getMask( seed );

			expect( mask.first ).toBe( 1 );
			expect( mask.foo ).toBe( 'bar' );

			expect( Object.keys(mask) ).toEqual( ['foo'] );
		});
	});
});