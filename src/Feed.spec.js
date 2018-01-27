describe('bmoor-data.Feed', function(){
	var Feed = require('./Feed.js');

	it('should be defined', function(){
		expect( Feed ).toBeDefined();
	});

	it('should instantiate correctly', function(){
		var feed = new Feed();

		expect( feed.on ).toBeDefined();
		expect( feed.data ).toBeDefined();
	});

	it('should instantiate correctly', function(){
		var t = [],
			feed = new Feed(t);

		expect( feed.on ).toBeDefined();
		expect( feed.data ).toBe( t );
	});

	it('should allow a push on the original source', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		feed.on('insert', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe( n );
			done();
		});

		t.push(n);
	});

	it('should allow unshift on the original source', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		feed.on('insert', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe( n );
			done();
		});

		t.unshift(n);
	});

	it('should have add calling insert correctly', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		feed.on('insert', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe( n );
			done();
		});

		feed.add(n);
	});

	it('should have add calling update correctly', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		feed.on('update', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBeUndefined( n );
			done();
		});

		feed.add(n);
	});

	it('should have consume working correctly', function( done ){
		var c = 0,
			t = [],
			n = {x:1},
			feed = new Feed(t);

		feed.once('insert', function( res ){
			expect( feed.data.length ).toBe( 1 );
			expect( res ).toEqual( {x:1} );
		});

		feed.add(n);

		feed.on('insert', function( res ){
			if ( c === 0 ){
				c++;
				expect( res ).toEqual( {x:2} );
				expect( feed.data.length ).toBe( 3 );
			}else{
				expect( res ).toEqual( {x:3} );
				expect( feed.data.length ).toBe( 3 );
			}

			done();
		});

		feed.consume([{x:2},{x:3}]);
	});
});