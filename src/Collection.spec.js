describe('bmoor-data.Collection', function(){
	const Proxy = require('./object/Proxy.js');
	const Collection = require('./Collection.js');

	it('should be defined', function(){
		expect( Collection ).toBeDefined();
	});

	it('should instantiate correctly', function(){
		var feed = new Collection();

		expect( feed.on ).toBeDefined();
		expect( feed.data.length ).toBe(0);
	});

	it('should instantiate correctly, with an prepop', function(){
		var feed = new Collection([]);

		expect( feed.on ).toBeDefined();
		expect( feed.data ).toBeDefined();
	});

	it('should return the same class via makeChild', function(){
		class MyCollection extends Collection{
			newProp(){
				return 'ok';
			}
		}

		var coll = new MyCollection();

		expect( coll.makeChild() instanceof MyCollection )
		.toBe( true );
	});

	it('should allow a push on the original source', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('next', function pushInsert(res){
			expect(feed.data[0]).toBe(n);
			expect(res).toBe(feed.data);
			
			setTimeout(done,0); // I do this to keep the stack trace manageable
		});

		t.push(n);
	});

	it('should allow unshift on the original source', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('next', function originalInsert(res){
			expect(feed.data[0]).toBe(n);
			expect(res).toBe(feed.data);
			
			setTimeout(done,0);
		});

		t.unshift(n);
	});

	it('should have add calling insert correctly', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('next', function correctInsert( res ){
			expect(feed.data[0]).toBe( n );
			expect(res).toBe(feed.data);
			
			done();
		});

		feed.add(n);
	});

	it('should have add calling update correctly', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('next', function correctUpdate(res){
			expect(feed.data[0]).toBe(n);
			expect(res).toBe(feed.data);
			
			setTimeout(done, 0);
		});

		feed.add(n);
	});

	it('should have remove calling update correctly', function( done ){
		var n = {foo:'bar'},
			t = [{foo:'eins'},{foo:'zwei'},n],
			feed = new Collection(t);

		feed.on('next', function correctRemove( res ){
			expect(feed.data.length).toBe(2);
			expect(feed.data[feed.data.length-1]).not.toBe(n);
			expect(res).toBe(feed.data);
			
			done();
		});

		feed.remove(n);
	});

	describe('::map', function(){
		it('should prepopulate', function(){
			var t = [{foo:'eins'},{foo:'zwei'},{foo:'drei'}],
				collection = new Collection(t);

			let mapped = collection.map((d) => {
				return { other: d.foo };
			});

			expect( mapped.data.length ).toBe( 3 );

			expect( mapped.data[0] ).toEqual({other:'eins'});
		});
	});

	describe('::sorted', function(){
		it('should prepopulate', function(){
			const t = [
				{foo:'eins'},
				{foo:'zwei'},
				{foo:'drei'}
			];
			const collection = new Collection(t);

			let sorted = collection.sorted((a,b) => {
				return a.foo < b.foo ? 
					1 : (a.foo > b.foo ? -1 : 0);
			});

			expect(sorted.data.length).toBe(0);

			collection._next.flush();
			sorted._next.flush();

			expect(sorted.data.length).toBe(3);
			expect(sorted.data[0]).toEqual({foo:'zwei'});
		});
	});

	describe('::filter', function(){
		it('should work correctly', function( done ){
			var n = {foo:'bar'},
				t = [
					{foo:'eins'},
					{foo:'zwei'},
					n
				],
				feed = new Collection(t),
				child = feed.filter(function( d ){
					return d.foo[0] === 'e';
				});

			expect(child.data.length).toBe(0);
		
			feed._next.flush();
			child._next.flush();

			expect(child.data.length).toBe(1);

			feed.add({foo:'ever'});

			child.once('next', function filterInsert(){
				expect(child.data.length).toBe(2);
				expect(feed.data.length).toBe(4);
				expect(child.data[child.data.length-1].foo).toBe('ever');

				child.on('next', function filterRemove(){
					expect(child.data.length).toBe(1);
					expect(feed.data.length).toBe(3);
					expect(feed.data[0].foo).toBe('zwei');
					expect(child.data[0].foo).toBe('ever');

					done();
				});

				feed.remove(feed.data[0]);
			});
		});

		it('should be able to filter by object', function(done){
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

			expect(child.data.length).toBe(0);
		
			feed._next.flush();
			child._next.flush();

			expect(child.data.length).toBe(3);

			feed.add({foo:'eins'});
			
			// I'm testing here the propagation delay
			expect( feed.data.length ).toBe( 8 );
			expect( child.data.length ).toBe( 3 );

			child.once('next', function(){
				expect( child.data.length ).toBe( 4 );

				child.add({foo:'eins'});
				
				child.on('next', function(){
					expect( child.data.length ).toBe( 5 );

					child.destroy();

					done();
				});
			});
		});

		it('should filter on the change of an object', function(done){
			var a = new Proxy({foo:'eins'}),
				b = new Proxy({foo:'zwei'}),
				t = [
					a,
					b,
					new Proxy({foo:'einser'}),
					new Proxy({foo:'eins'}),
					new Proxy({foo:'eins'}),
					new Proxy({foo:'zwei'}),
					new Proxy({foo:'drei'})
				],
				feed = new Collection(t),
				child = feed.filter(
					{ foo: 'eins' },
					{ massage: d => d.getDatum() }
				);

			expect(child.data.length).toBe(0);

			feed._next.flush();
			child._next.flush();

			expect(child.data.length).toBe(3);

			child.on('next', function(res){
				expect(res.length).toBe(2);

				done();
			});

			a.merge({foo:'nope'});
		});

		it('should be able to filter by array index', function( done ){
			var n = {foo:'bar'},
				t = [
					{foo:'eins'},
					{foo:'zwei'},
					n
				],
				feed = new Collection(t),
				child = feed.filter(
					{ foo:{ 0: 'e' } }
				);

			expect(child.data.length).toBe(0);

			feed._next.flush();
			child._next.flush();

			expect(child.data.length).toBe(1);

			child.once('next', function filterInsert(){
				expect(child.data.length).toBe(2);
				expect(feed.data.length).toBe(5);
				expect(child.data[0].foo).toBe('eins');

				child.on('next', function filterRemove( res ){
					expect(child.data.length).toBe(1);
					expect(feed.data.length).toBe(4);
					expect(res[0].foo).toBe('ever');

					done();
				});

				feed.remove(feed.data[0]);
			});
			
			feed.add({foo:'zoo'});
			feed.add({foo:'ever'});
		});
	});

	describe('::select', function(){
		it('should work correctly', function(){
			var t = [
					{id:1, foo:'eins',value:'yes'},
					{id:3, foo:'zwei',value:'no'},
					{id:2, foo:'bar',value:'no'},
					{id:4, foo:'fier',value:'YES'}
				],
				feed = new Collection(t),
				test = {},
				child = feed.select({
					normalizeDatum: function( datum ){
						return { value: datum.value.toLowerCase() };
					},
					normalizeContext: function(){
						if ( test.value ){
							return test.value.toLowerCase();
						}else{
							return null;
						}
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

			expect(child.data.length).toBe(0);
		
			test.value = 'YeS';

			feed._next.flush();
			child._next.flush();

			expect(child.data.length).toBe( 2 );
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

			feed._next.flush();
			child._next.flush();

			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(0);
			expect( child.nav.start ).toBe(0);
			expect( child.nav.stop ).toBe(2);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'eins' );
			
			child.nav.next();
			child._next.flush();

			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(1);
			expect( child.nav.start ).toBe(2);
			expect( child.nav.stop ).toBe(4);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'bar' );

			child.nav.next();
			child._next.flush();
			
			expect( child.data.length ).toBe( 2 );
			expect( child.data[0].foo ).toBe( 'funf' );

			child.nav.next();
			child._next.flush();
			
			expect( child.data.length ).toBe( 1 );
			expect( child.nav.pos ).toBe(3);
			expect( child.nav.start ).toBe(6);
			expect( child.nav.stop ).toBe(7);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'sieben' );

			child.nav.prev();
			child.nav.prev();
			child._next.flush();
			
			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(1);
			expect( child.nav.start ).toBe(2);
			expect( child.nav.stop ).toBe(4);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'bar' );
		});

		it('should allow goto an object', function(){
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

			child.nav.goto(t[2]);
			child.go();

			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(1);
			expect( child.nav.start ).toBe(2);
			expect( child.nav.stop ).toBe(4);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'bar' );

			child.nav.goto(t[3]);
			child.go();

			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(1);
			expect( child.nav.start ).toBe(2);
			expect( child.nav.stop ).toBe(4);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'bar' );

			child.nav.goto(t[5]);
			child.go();

			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(2);
			expect( child.nav.start ).toBe(4);
			expect( child.nav.stop ).toBe(6);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'funf' );

			child.nav.goto(t[6]);
			child.go();

			expect( child.data.length ).toBe( 1 );
			expect( child.nav.pos ).toBe(3);
			expect( child.nav.start ).toBe(6);
			expect( child.nav.stop ).toBe(7);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'sieben' );

			// search for something out of the list
			child.nav.goto({});
			child.go();

			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(0);
			expect( child.nav.start ).toBe(0);
			expect( child.nav.stop ).toBe(2);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'eins' );
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
				child = feed.select({
					normalizeDatum: function( datum ){
						return { value: datum.value.toLowerCase() };
					},
					normalizeContext: function(){
						if ( test.value ){
							return test.value.toLowerCase();
						}else{
							return null;
						}
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

			child.parent.go();
			child.go();

			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(0);
			expect( child.nav.start ).toBe(0);
			expect( child.nav.stop ).toBe(2);
			expect( child.nav.steps ).toBe(4);
			expect( child.nav.count ).toBe(7);
			expect( child.data[0].foo ).toBe( 'eins' );
			
			test.value = 'Yes';

			child.parent.go();
			child.go();

			expect( child.data.length ).toBe( 2 );
			expect( child.nav.pos ).toBe(0);
			expect( child.nav.start ).toBe(0);
			expect( child.nav.stop ).toBe(2);
			expect( child.nav.steps ).toBe(2);
			expect( child.nav.count ).toBe(3);
			expect( child.data[0].foo ).toBe( 'eins' );

			child.nav.next();
			child.go();
			
			expect( child.data.length ).toBe( 1 );
			expect( child.nav.pos ).toBe(1);
			expect( child.nav.start ).toBe(2);
			expect( child.nav.stop ).toBe(3);
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
				child = feed.select({
					normalizeDatum: function( datum ){
						return { value: datum.value.toLowerCase() };
					},
					normalizeContext: function(){
						if ( test.value ){
							return test.value.toLowerCase();
						}else{
							return null;
						}
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

			child.on('next', function(){
				expect( bool ).toBe( true );
				done();
			});

			test.value = 'yes';

			feed.add({id:2, foo:'other', value:'yes'});
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

			parent._next.flush();
		});

		it('should take all elements from the parent', function(){
			expect( child.get(1) ).toBe( parent.data[0] );
			expect( child.get(2) ).toBe( parent.data[1] );
			expect( child.get(3) ).toBe( parent.data[2] );
			expect( child.get(4) ).toBeUndefined();
		});

		it('should index new insertions', function(){
			parent.add({ 'type': 'dog', id:4 });

			parent.on('next', function(){
				expect( child.get(4) ).toBe( parent.data[3] );
			});
		});

		it('should unindex removals', function(){
			parent.remove( child.get(2) );

			parent._next.flush();
			
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
			expect(child.get('woot').data.length).toBe(0);
		});

		it('should route new elements to proper buckets', function(){
			parent.add({ 'type': 'dog', id:4 });
			parent.add({ 'type': 'cat', id:5 });
			parent.add({ 'type': 'monkey', id: 6 });

			parent._next.flush();

			expect( child.get('dog').data.length ).toBe( 3 );
			expect( child.get('cat').data.length ).toBe( 2 );
			expect( child.get('monkey').data.length ).toBe( 1 );
		});

		it('should properly reroute buckets', function( done ){
			var t = child.get('dog').data[0],
				dog = false,
				pig = false;

			t.type = 'pig';

			child.get('dog').on('next', function(){
				dog = true;
			});

			child.get('pig').on('next', function(){
				pig = true;
			});

			child.reroute( t );

			expect( child.get('dog').data.length ).toBe( 1 );
			expect( child.get('dog').data[0].id ).toBe( 3 );
			expect( child.get('pig').data.length ).toBe( 1 );
			expect( child.get('pig').data[0].id ).toBe( 1 );

			setTimeout(function(){
				expect( dog ).toBe( true );
				expect( pig ).toBe( true );

				child.disconnect();

				done();
			}, 30);
		});
	});

	describe('::promise', function(){
		it('should not fire if there is no data defined', function(done){
			const collection = new Collection();

			let fired = false;

			collection.promise().then(() => {
				fired = true;
			});

			setTimeout(function(){
				expect(fired).toBe(false);

				done();
			}, 100);
		});

		it('should fire if there is data defined', function(done){
			const collection = new Collection([
				{foo:'bar'}
			]);

			let fired = false;

			collection.promise().then(() => {
				fired = true;
			});

			setTimeout(function(){
				expect(fired).toBe(true);
				
				done();
			}, 100);
		});

		it('should fire if there is data is added', function(done){
			const collection = new Collection();

			let fired = false;

			collection.promise().then(() => {
				fired = true;
			});

			collection.add({
				foo: 'bar2'
			});

			setTimeout(function(){
				expect(fired).toBe(true);
				
				done();
			}, 100);
		});
	});
});
