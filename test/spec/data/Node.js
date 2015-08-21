describe('bmoor.data.Node', function(){
	var Node,
		Test;

	beforeEach(bMoor.test.injector(
		['bmoor.data.Node',
		function( N ){
			Node = N;
		}]
	));

	it('should be defined', function(){
		expect( Node ).toBeDefined();
	});

	describe('updating', function(){
		it('should be updatable through update via a value set', function(){
			var t = {},
				n = new Node(t);

			n.$update(function(p){
				p.foo = {
					'bar' : true
				};

				return {
					foo: {
						bar: true
					}
				};
			});

			expect( t.foo.bar ).toBeDefined();
		});

		it('should be updatable through update via a function call', function(){
			var t = {},
				p = { 'save' : 'me' },
				n = new Node(t);

			n.$update( 'foo.bar', 1 );
			n.$update( 'hello.world', p );
			n.$update( 'test', 'test' );

			expect( t.foo.bar ).toBe( 1 );
			expect( t.hello.world ).toBe( p );
			expect( t.test ).toBe( 'test' );
		});

		it('should be updatable through update via an exploded object', function(){
			var t = {},
				p = { 'save' : 'me' },
				n = new Node(t);

			n.$update({
				'foo.bar': 1,
				'hello.world': p,
				'test': 'test'
			});

			expect( t.foo.bar ).toBe( 1 );
			expect( t.hello.world ).toBe( p );
			expect( t.test ).toBe( 'test' );
		});

		it('should be updatable through update via an merge object', function(){
			var t = {},
				p = { 'save' : 'me' },
				n = new Node(t);

			n.$update({
				foo: {
					bar: 1
				},
				hello: {
					world: p
				},
				test: 'test'
			});

			expect( t.foo.bar ).toBe( 1 );
			expect( t.hello.world ).toBe( p );
			expect( t.test ).toBe( 'test' );
		});
	});

	describe('watching', function(){
		it('should get triggered during update via a value set', function(){
			var ping = false,
				t = {},
				n = new Node(t);

			n.$watch(function(){
				ping = true;
			});

			n.$update(function(p){
				p.foo = {
					'bar' : true
				};

				return {
					foo: {
						bar: true
					}
				};
			});

			expect( ping ).toBe( true );
		});

		it('should be updatable through update via a function call', function(){
			var ping = false,
				t = {},
				p = { 'save' : 'me' },
				n = new Node(t);

			n.$watch(function(){
				ping = true;
			});

			n.$update( 'hello.world', p );
		
			expect( ping ).toBe( true );
		});

		it('should be updatable through update via an exploded object', function(){
			var ping = false, 
				t = {},
				p = { 'save' : 'me' },
				n = new Node(t);

			n.$watch(function(){
				ping = true;
			});

			n.$update({
				'foo.bar': 1,
				'hello.world': p,
				'test': 'test'
			});

			expect( ping ).toBe( true );
		});
	});
});