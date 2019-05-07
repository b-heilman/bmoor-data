describe('bmoor-data.Feed', function(){
	var Feed = require('./Feed.js');

	it('should be defined', function(){
		expect( Feed ).toBeDefined();
	});

	it('should instantiate correctly', function(){
		var feed = new Feed();

		expect( feed.on ).toBeDefined();
		expect( feed.data.length ).toBe(0);
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

		feed.on('next', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe(feed);
			done();
		});

		t.push(n);
	});

	it('should allow unshift on the original source', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		feed.on('next', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe(feed);
			done();
		});

		t.unshift(n);
	});

	it('should have add calling insert correctly', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		feed.on('next', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe(feed);
			done();
		});

		feed.add(n);
	});

	it('should have add calling update correctly', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		feed.on('next', function( res ){
			expect(feed.data[0]).toBe(n);
			expect(res).toBe(feed);
			done();
		});

		feed.add(n);
	});

	it('should have consume working correctly', function( done ){
		var t = [],
			n = {x:1},
			feed = new Feed(t);

		feed.once('next', function( res ){
			expect(feed.data[0]).toBe(n);
			expect(feed.data.length).toBe(1);
			expect(res).toEqual(feed);

			feed.on('next', function(res){
				expect(feed.data[0]).toBe(n);
				expect(feed.data.length).toBe(3);
				expect(res).toEqual(feed);

				done();
			});

			feed.consume([{x:2},{x:3}]);
		});

		feed.add(n);
	});
});