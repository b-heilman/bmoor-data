describe('bmoor-data.Collection', function(){
	var Collection = bmoorData.Collection;

	it('should be defined', function(){
		expect( Collection ).toBeDefined();
	});

	it('should instantiate correctly', function(){
		var feed = new Collection();

		expect( feed.on ).toBeDefined();
		expect( feed.data ).toBeDefined();
	});

	it('should allow a push on the original source', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('insert', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res[0] ).toBe( n );
			done();
		});

		t.push(n);
	});

	it('should allow unshift on the original source', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('insert', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res[0] ).toBe( n );
			done();
		});

		t.unshift(n);
	});

	it('should have add calling insert correctly', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('insert', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res[0] ).toBe( n );
			done();
		});

		feed.add(n);
	});

	it('should have add calling update correctly', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('update', function( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBeUndefined( n );
			done();
		});

		feed.add(n);
	});

	it('should have remove calling update correctly', function( done ){
		var n = {foo:'bar'},
			t = [{foo:'eins'},{foo:'zwei'},n],
			feed = new Collection(t);

		feed.on('remove', function( res ){
			expect( feed.data.length ).toBe( 2 );
			expect( feed.data[feed.data.length-1] ).not.toBe( n );
			expect( res[0] ).toBe( n );
			done();
		});

		feed.remove(n);
	});

	describe('filter', function(){
		it('should work correctly', function( done ){
			var n = {foo:'bar'},
				t = [{foo:'eins'},{foo:'zwei'},n],
				feed = new Collection(t),
				child = feed.filter(function( d ){
					return d.foo[0] === 'e';
				});

			expect( child.data.length ).toBe( 1 );
		
			child.on('insert', function( res ){
				expect( child.data.length ).toBe( 2 );
				expect( feed.data.length ).toBe( 5 );
				expect( res[0].foo ).toBe( 'ever' );

				child.on('remove', function( res ){
					expect( child.data.length ).toBe( 1 );
					expect( feed.data.length ).toBe( 4 );
					expect( res[0].foo ).toBe( 'eins' );

					done();
				});

				feed.remove( feed.data[0] );
			});

			feed.add({foo:'zoo'});
			feed.add({foo:'ever'});
		});
	});

	describe('route', function(){
		var child,
			parent;

		beforeEach(function( done ){
			parent = new Collection([
				{ type: 'dog', id: 1 },
				{ type: 'cat', id: 2 },
				{ type: 'dog', id: 3 }
			]),
			child = parent.route(function( d ){
				return d.type;
			});

			setTimeout(function(){
				// allows data to run
				done();
			});
		});

		it('should take all elements from the parent', function(){
			expect( child.get('dog').data.length ).toBe( 2 );
			expect( child.get('cat').data.length ).toBe( 1 );
		});

		it('should return back a collection even on a miss', function(){
			expect( child.get('woot').data.length ).toBe( 0 );
		});

		it('should route new elements to proper buckets', function( done ){
			parent.add({ 'type': 'dog', id:4 });
			parent.add({ 'type': 'cat', id:5 });
			parent.add({ 'type': 'monkey', id: 6 });

			setTimeout(function(){
				expect( child.get('dog').data.length ).toBe( 3 );
				expect( child.get('cat').data.length ).toBe( 2 );
				expect( child.get('monkey').data.length ).toBe( 1 );
			
				done();
			}, 100); // it has to go through two rounds of updates
		});
	});
});
