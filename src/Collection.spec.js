describe('bmoor-data.Collection', function(){
	var Collection = require('./Collection.js');

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

		feed.on('insert', function pushInsert( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe( n );
			
			setTimeout(done,0); // I do this to keep the stack trace manageable
		});

		t.push(n);
	});

	it('should allow unshift on the original source', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('insert', function originalInsert( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe( n );
			
			setTimeout(done,0);
		});

		t.unshift(n);
	});

	it('should have add calling insert correctly', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('insert', function correctInsert( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBe( n );
			
			setTimeout(done,0);
		});

		feed.add(n);
	});

	it('should have add calling update correctly', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('update', function correctUpdate( res ){
			expect( feed.data[0] ).toBe( n );
			expect( res ).toBeUndefined( n );
			
			setTimeout(done,0);
		});

		feed.add(n);
	});

	it('should have remove calling update correctly', function( done ){
		var n = {foo:'bar'},
			t = [{foo:'eins'},{foo:'zwei'},n],
			feed = new Collection(t);

		feed.on('remove', function correctRemove( res ){
			expect( feed.data.length ).toBe( 2 );
			expect( feed.data[feed.data.length-1] ).not.toBe( n );
			expect( res ).toBe( n );
			
			setTimeout(done,0);
		});

		feed.remove(n);
	});

	describe('::filter', function(){
		it('should work correctly', function( done ){
			var n = {foo:'bar'},
				t = [{foo:'eins'},{foo:'zwei'},n],
				feed = new Collection(t),
				child = feed.filter(function( d ){
					return d.foo[0] === 'e';
				});

			expect( child.data.length ).toBe( 1 );
		
			feed.add({foo:'zoo'});

			child.on('insert', function filterInsert( res ){
				expect( child.data.length ).toBe( 2 );
				expect( feed.data.length ).toBe( 5 );
				expect( res.foo ).toBe( 'ever' );

				child.on('remove', function filterRemove( res ){
					expect( child.data.length ).toBe( 1 );
					expect( feed.data.length ).toBe( 4 );
					expect( res.foo ).toBe( 'eins' );

					setTimeout(done,0);
				});

				feed.remove( feed.data[0] );
			});

			
			feed.add({foo:'ever'});

			child.disconnect();
		});

		it('should be able to filter by object', function(){
			var t = [
					{foo:'eins'},
					{foo:'zwei'},
					{foo:'einser'},
					{foo:'eins'},
					{foo:'eins'},
					{foo:'zwei'},
					{foo:'drei'}
				],
				feed = new Collection(t),
				child = feed.filter(
					{ foo: 'eins' }
				);

			expect( child.data.length ).toBe( 3 );
		
			feed.add({foo:'eins'});
			
			expect( child.data.length ).toBe( 4 );

			child.add({foo:'eins'});
			
			expect( child.data.length ).toBe( 5 );

			child.destroy();
		});

		it('should be able to filter by array index', function( done ){
			var n = {foo:'bar'},
				t = [{foo:'eins'},{foo:'zwei'},n],
				feed = new Collection(t),
				child = feed.filter(
					{ foo:{ 0: 'e' } }
				);

			expect( child.data.length ).toBe( 1 );
		
			feed.add({foo:'zoo'});

			child.on('insert', function filterInsert( res ){
				expect( child.data.length ).toBe( 2 );
				expect( feed.data.length ).toBe( 5 );
				expect( res.foo ).toBe( 'ever' );

				child.on('remove', function filterRemove( res ){
					expect( child.data.length ).toBe( 1 );
					expect( feed.data.length ).toBe( 4 );
					expect( res.foo ).toBe( 'eins' );

					setTimeout(done,0);
				});

				feed.remove( feed.data[0] );
			});
			
			feed.add({foo:'ever'});

			child.disconnect();
		});
	});

	describe('::search', function(){
		it('should work correctly', function(){
			var t = [
					{id:1, foo:'eins',value:'yes'},
					{id:3, foo:'zwei',value:'no'},
					{id:2, foo:'bar',value:'no'},
					{id:4, foo:'fier',value:'YES'}
				],
				feed = new Collection(t),
				test = {},
				child = feed.search({
					normalize: function(){
						if ( test.value ){
							return test.value.toLowerCase();
						}else{
							return null;
						}
					},
					massage: function( datum ){
						return { value: datum.value.toLowerCase() };
					},
					tests: [
						function( datum, ctx ){
							return ctx === null;
						},
						function( datum, ctx ){
							return datum.value === ctx;
						}
					]
				});

			expect( child.data.length ).toBe( 4 );
		
			test.value = 'YeS';
			child.go.flush();

			expect( child.data.length ).toBe( 2 );

			child.disconnect();
		});
	});

	describe('::paginate', function(){
		it('should work correctly', function(){
			var t = [
					{id:1, foo:'eins',value:'yes'},
					{id:3, foo:'zwei',value:'no'},
					{id:2, foo:'bar',value:'no'},
					{id:4, foo:'fier',value:'YES'},
					{id:5, foo:'funf',value:'yes'},
					{id:6, foo:'sechs',value:'no'},
					{id:7, foo:'sieben',value:'no'}
				],
				feed = new Collection(t),
				child = feed.paginate({
					size: 2
				});

			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(0);
			expect( child.nav.start ).toBe(0);
			expect( child.nav.stop ).toBe(2);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'eins' );
			
			child.nav.next();
			child.go.flush();

			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(1);
			expect( child.nav.start ).toBe(2);
			expect( child.nav.stop ).toBe(4);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'bar' );

			child.nav.next();
			child.go.flush();
			
			expect( child.data.length ).toBe( 2 );
			expect( child.data[0].foo ).toBe( 'funf' );

			child.nav.next();
			child.go.flush();
			
			expect( child.data.length ).toBe( 1 );
			expect( child.nav.pos ).toBe(3);
			expect( child.nav.start ).toBe(6);
			expect( child.nav.stop ).toBe(8);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'sieben' );

			child.nav.prev();
			child.nav.prev();
			child.go.flush();
			
			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(1);
			expect( child.nav.start ).toBe(2);
			expect( child.nav.stop ).toBe(4);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'bar' );
		});

		it('should be able to be chained into', function(){
			var t = [
					{id:1, foo:'eins',value:'yes'},
					{id:3, foo:'zwei',value:'no'},
					{id:2, foo:'bar',value:'no'},
					{id:4, foo:'fier',value:'YES'},
					{id:5, foo:'funf',value:'yes'},
					{id:6, foo:'sechs',value:'no'},
					{id:7, foo:'sieben',value:'no'}
				],
				feed = new Collection(t),
				test = {},
				child = feed.search({
					normalize: function(){
						if ( test.value ){
							return test.value.toLowerCase();
						}else{
							return null;
						}
					},
					massage: function( datum ){
						return { value: datum.value.toLowerCase() };
					},
					tests: [
						function( datum, ctx ){
							return ctx === null;
						},
						function( datum, ctx ){
							return datum.value === ctx;
						}
					]
				}).paginate({
					size: 2
				});

			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(0);
			expect( child.nav.start ).toBe(0);
			expect( child.nav.stop ).toBe(2);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'eins' );
			
			test.value = 'Yes';

			child.parent.go.flush();
			child.go.flush();

			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(0);
			expect( child.nav.start ).toBe(0);
			expect( child.nav.stop ).toBe(2);
			expect( child.nav.steps ).toBe(2);
			expect( child.nav.count ).toBe(3);
			expect( child.data[0].foo ).toBe( 'eins' );

			child.nav.next();
			child.go.flush();
			
			expect( child.data.length ).toBe( 1 );
			expect( child.nav.pos ).toBe(1);
			expect( child.nav.start ).toBe(2);
			expect( child.nav.stop ).toBe(4);
			expect( child.nav.steps ).toBe(2);
			expect( child.nav.count ).toBe(3);
			expect( child.data[0].foo ).toBe( 'funf' );
		});

		it('should chain process events', function( done ){
			var bool = true,
				t = [
					{id:1, foo:'eins',value:'yes'},
					{id:3, foo:'zwei',value:'no'}
				],
				feed = new Collection(t),
				test = {},
				child = feed.search({
					normalize: function(){
						if ( test.value ){
							return test.value.toLowerCase();
						}else{
							return null;
						}
					},
					massage: function( datum ){
						return { value: datum.value.toLowerCase() };
					},
					tests: [
						function( datum, ctx ){
							return ctx === null;
						},
						function( datum, ctx ){
							return datum.value === ctx;
						}
					]
				}).paginate({
					size: 2
				});

			child.on('process', function(){
				expect( bool ).toBe( true );
				done();
			});

			test.value = 'yes';

			feed.add({id:2, foo:'other', value:'yes'});

			child.disconnect();
		});
	});

	describe('::index', function(){
		var child,
			parent;

		beforeEach(function(){
			parent = new Collection([
				{ type: 'dog', id: 1 },
				{ type: 'cat', id: 2 },
				{ type: 'dog', id: 3 }
			]);
			child = parent.index(function( d ){
				return d.id;
			});
		});

		it('should take all elements from the parent', function(){
			expect( child.get(1) ).toBe( parent.data[0] );
			expect( child.get(2) ).toBe( parent.data[1] );
			expect( child.get(3) ).toBe( parent.data[2] );
			expect( child.get(4) ).toBeUndefined();
		});

		it('should index new insertions', function(){
			parent.add({ 'type': 'dog', id:4 });

			expect( child.get(4) ).toBe( parent.data[3] );
		});

		it('should unindex removals', function(){
			parent.remove( child.get(2) );

			expect( child.get(2) ).toBeUndefined();

			child.disconnect();
		});
	});

	describe('::route', function(){
		var child,
			parent;

		beforeEach(function(){
			parent = new Collection([
				{ type: 'dog', id: 1 },
				{ type: 'cat', id: 2 },
				{ type: 'dog', id: 3 }
			]);
			child = parent.route(function( d ){
				return d.type;
			});
		});

		it('should take all elements from the parent', function(){
			expect( child.get('dog').data.length ).toBe( 2 );
			expect( child.get('cat').data.length ).toBe( 1 );
		});

		it('should return back a collection even on a miss', function(){
			expect( child.get('woot').data.length ).toBe( 0 );
		});

		it('should route new elements to proper buckets', function(){
			parent.add({ 'type': 'dog', id:4 });
			parent.add({ 'type': 'cat', id:5 });
			parent.add({ 'type': 'monkey', id: 6 });

			expect( child.get('dog').data.length ).toBe( 3 );
			expect( child.get('cat').data.length ).toBe( 2 );
			expect( child.get('monkey').data.length ).toBe( 1 );
		});

		it('should properly reroute buckets', function(){
			var t = child.get('dog').data[0],
				dog = false,
				pig = false;

			t.type = 'pig';

			child.get('dog').on('update', function(){
				dog = true;
			});

			child.get('pig').on('update', function(){
				pig = true;
			});

			child.reroute( t );

			expect( child.get('dog').data.length ).toBe( 1 );
			expect( child.get('dog').data[0].id ).toBe( 3 );
			expect( child.get('pig').data.length ).toBe( 1 );
			expect( child.get('pig').data[0].id ).toBe( 1 );

			expect( dog ).toBe( true );
			expect( pig ).toBe( true );

			child.disconnect();
		});
	});
});
