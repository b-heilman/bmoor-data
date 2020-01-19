
const {expect} = require('chai');

describe('bmoor-data.Feed', function(){
	var {Feed} = require('./Feed.js');

	it('should be defined', function(){
		expect( Feed ).to.exist;
	});

	it('should instantiate correctly', function(){
		var feed = new Feed();

		expect( feed.on ).to.exist;
		expect( feed.data.length ).to.equal(0);
	});

	it('should instantiate correctly', function(){
		var t = [],
			feed = new Feed(t);

		expect( feed.on ).to.exist;
		expect( feed.data ).to.equal( t );
	});

	it('should allow a push on the original source', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		t.push(n);

		feed.on('next', function( res ){
			expect( feed.data[0] ).to.equal( n );
			expect( res ).to.equal(feed.data);
			done();
		});
	});

	it('should allow adding to the feed', function( done ){
		var n = {},
			feed = new Feed();

		feed.on('next', function( res ){
			expect( feed.data[0] ).to.equal( n );
			expect( res ).to.equal(feed.data);
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
			expect( feed.data[0] ).to.equal( n );
			expect( res ).to.equal(feed.data);
			done();
		});
	});

	it('should have add calling insert correctly', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		feed.add(n);

		feed.on('next', function( res ){
			expect( feed.data[0] ).to.equal( n );
			expect( res ).to.equal(feed.data);
			done();
		});
	});

	it('should have add calling update correctly', function( done ){
		var t = [],
			n = {},
			feed = new Feed(t);

		feed.add(n);

		feed.on('next', function( res ){
			expect(feed.data[0]).to.equal(n);
			expect(res).to.equal(feed.data);
			done();
		});
	});

	it('should have consume working correctly', function( done ){
		var t = [],
			n = {x:1},
			feed = new Feed(t);
		
		feed.add(n);

		feed.once('next', function( res ){
			expect(feed.data[0]).to.equal(n);
			expect(feed.data.length).to.equal(1);
			expect(res).to.deep.equal(feed.data);

			feed.consume([{x:2},{x:3}]);
			
			feed.on('next', function(res){
				expect(feed.data[0]).to.equal(n);
				expect(feed.data.length).to.equal(3);
				expect(res).to.deep.equal(feed.data);

				done();
			});
		});
	});

	it('should have consume working correctly - twice', function( done ){
		var t = [],
			n = {x:1},
			feed = new Feed(t);
		
		feed.add(n);

		feed.once('next', function( res ){
			expect(feed.data[0]).to.equal(n);
			expect(feed.data.length).to.equal(1);
			expect(res).to.deep.equal(feed.data);

			let callCount = 0;
			feed.on('next', function(res){
				expect(feed.data[0]).to.equal(n);
				expect(feed.data.length).to.equal(3);
				expect(res).to.deep.equal(feed.data);

				callCount++;

				if (callCount === 2){
					done();
				}
			});

			feed.consume([{x:2},{x:3}]);
		});
	});
});