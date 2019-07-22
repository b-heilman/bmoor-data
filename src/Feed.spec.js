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

		t.push(n);

		feed.on('next', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe(feed.data);
			done();
		});
	});

	it('should allow adding to the feed', function( done ){
		var n = {},
			feed = new Feed();

		feed.on('next', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe(feed.data);
			done();
		});

		feed.add(n);
	});

	it('should allow unshift on the original source', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		t.unshift(n);

		feed.on('next', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe(feed.data);
			done();
		});
	});

	it('should have add calling insert correctly', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		feed.add(n);

		feed.on('next', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe(feed.data);
			done();
		});
	});

	it('should have add calling update correctly', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		feed.add(n);

		feed.on('next', function( res ){
			expect(feed.data[0]).toBe(n);
			expect(res).toBe(feed.data);
			done();
		});
	});

	it('should have consume working correctly', function( done ){
		var t = [],
			n = {x:1},
			feed = new Feed(t);

		feed.add(n);

		feed.once('next', function( res ){
			expect(feed.data[0]).toBe(n);
			expect(feed.data.length).toBe(1);
			expect(res).toEqual(feed.data);

			feed.on('next', function(res){
				expect(feed.data[0]).toBe(n);
				expect(feed.data.length).toBe(3);
				expect(res).toEqual(feed.data);

				done();
			});

			feed.consume([{x:2},{x:3}]);
		});
	});
});