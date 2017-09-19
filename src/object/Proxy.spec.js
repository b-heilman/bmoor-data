describe('bmoor-data.object.Proxy', function(){
	var Proxy = bmoorData.object.Proxy;

	it('should be defined', function(){
		expect( Proxy ).toBeDefined();
	});

	describe('isDirty', function(){
		it('should work with null', function(){
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy( target ),
				mask = proxy.getMask();

			expect( proxy.isDirty() ).toBe( false );

			mask.foo = null;

			expect( proxy.isDirty() ).toBe( true );
		});

		it('should work with null, via static method', function(){
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy( target ),
				mask = proxy.getMask();

			expect( Proxy.isDirty(mask) ).toBe( false );

			mask.foo = null;

			expect( Proxy.isDirty(mask) ).toBe( true );
		});
	});

	describe('getChanges', function(){
		it('should work with null', function(){
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy( target ),
				mask = proxy.getMask();

			expect( proxy.getChanges() ).toBeUndefined();

			mask.foo = null;

			expect( proxy.getChanges() ).toEqual( {foo:null} );
		});

		it('should work with null, via static method', function(){
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy( target ),
				mask = proxy.getMask();

			expect( proxy.getChanges() ).toBeUndefined();

			mask.foo = null;

			expect( proxy.getChanges() ).toEqual( {foo:null} );
		});
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
					first: 1,
					hello: 'world',
					blar: {}
				},
				proxy = new Proxy( target ),
				seed = {
					foo: 'bar',
					blar: null,
					hello: 'world2'
				},
				mask = proxy.getMask( seed );

			expect( mask.first ).toBe( 1 );
			expect( mask.foo ).toBe( 'bar' );
			expect( mask.hello ).toBe( 'world2' );
			expect( mask.blar ).toBe( null );

			expect( Object.keys(mask) ).toEqual( ['blar','foo','hello'] );
		});
	});

	describe('deep masks', function(){
		it('should create masks recursively', function(){
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					}
				},
				proxy = new Proxy( target ),
				mask = proxy.getMask();

			expect( mask.hello.hasOwnProperty('cruel') )
				.toBe( false );
			expect( mask.hello.cruel ).toBeDefined();

			mask.hello.woot = 'ox';
			mask.hello.cruel = 'hi';

			expect( target.hello.cruel ).toBe( 'world' );
			expect( mask.hello.cruel ).toBe( 'hi' );

			expect( target.hello.woot ).toBeUndefined();
			expect( mask.hello.woot ).toBe( 'ox' );
		});

		it('should detect changes', function(){
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy( target ),
				mask = proxy.getMask();

			expect( proxy.isDirty() ).toBe( false );
			expect( proxy.getChanges() ).toBeUndefined();

			mask.hello.woot = 'ox';
			mask.eins = 'hi';

			expect( proxy.isDirty() ).toBe( true );
			expect( proxy.getChanges() ).toEqual({
				hello: {
					woot: 'ox'
				},
				eins: 'hi'
			});
		});
	});
});