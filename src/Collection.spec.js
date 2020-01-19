
const {expect} = require('chai');

describe('bmoor-data.Collection', function(){
	const {Proxy} = require('./object/Proxy.js');
	const {Collection} = require('./Collection.js');

	it('should be defined', function(){
		expect( Collection ).to.exist;
	});

	it('should instantiate correctly', function(){
		var feed = new Collection();

		expect( feed.subscribe ).to.exist;
		expect( feed.data.length ).to.equal(0);
	});

	it('should instantiate correctly, with an prepop', function(){
		var feed = new Collection([]);

		expect( feed.subscribe ).to.exist;
		expect( feed.data ).to.exist;
	});

	it('should instantiate correctly, with an prepop', function(){
		var feed = new Collection([123]);

		expect( feed.subscribe ).to.exist;
		expect( feed.data.length ).to.equal(1);
	});

	it('should allow a push on the original source', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('next', function pushInsert(res){
			expect(feed.data[0]).to.equal(n);
			expect(res).to.equal(feed.data);
			
			setTimeout(done,0); // I do this to keep the stack trace manageable
		});

		t.push(n);
	});
	
	it('should allow unshift on the original source', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('next', function originalInsert(res){
			expect(feed.data[0]).to.equal(n);
			expect(res).to.equal(feed.data);
			
			done();
		});

		t.unshift(n);
	});

	it('should have add calling insert correctly', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('next', function correctInsert( res ){
			expect(feed.data[0]).to.equal( n );
			expect(res).to.equal(feed.data);
			
			done();
		});

		feed.add(n);
	});

	it('should have add calling update correctly', function( done ){
		var t = [],
			n = {},
			feed = new Collection(t);

		feed.on('next', function correctUpdate(res){
			expect(feed.data[0]).to.equal(n);
			expect(res).to.equal(feed.data);
			
			setTimeout(done, 0);
		});

		feed.add(n);
	});

	it('should have remove calling update correctly', function( done ){
		var n = {foo:'bar'},
			t = [{foo:'eins'},{foo:'zwei'},n],
			feed = new Collection(t);

		feed.remove(n);

		feed.on('next', function correctRemove( res ){
			expect(feed.data.length).to.equal(2);
			expect(feed.data[feed.data.length-1]).not.to.equal(n);
			expect(res).to.equal(feed.data);
			
			done();
		});
	});

	describe('::map', function(){
		it('should prepopulate', function(done){
			var t = [{foo:'eins'},{foo:'zwei'},{foo:'drei'}],
				collection = new Collection(t);

			let mapped = collection.map((d) => {
				return { other: d.foo };
			});

			mapped.subscribe(data => {
				expect(data.length).to.equal(3);

				expect(data[0]).to.deep.equal({other:'eins'});

				done();
			});
		});
	});

	describe('::sorted', function(){
		it('should prepopulate', function(done){
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

			sorted.callStack([
				function(){
					expect(sorted.data.length).to.equal(3);
					expect(sorted.data[0]).to.deep.equal({foo:'zwei'});

					sorted.data[0].foo = 'apple';

					collection.publish();
				},
				function(){
					expect(sorted.data.length).to.equal(3);
					expect(sorted.data[0]).to.deep.equal({foo:'eins'});

					done();
				}
			]);
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
		
			child.callStack([
				function(data){
					expect(data.length).to.equal(1);

					n.foo = 'eieio';
					feed.publish();
				},
				function(){
					expect(child.data.length).to.equal(2);

					n.foo = 'boom';

					feed.add({foo:'ever'});
				},
				function(){
					expect(child.data.length).to.equal(2);
					expect(feed.data.length).to.equal(4);
					expect(child.data[child.data.length-1].foo).to.equal('ever');

					feed.remove(feed.data[0]);
				},
				function(){
					expect(child.data.length).to.equal(1);
					expect(feed.data.length).to.equal(3);
					expect(feed.data[0].foo).to.equal('zwei');
					expect(child.data[0].foo).to.equal('ever');

					done();
				}
			]);
		});

		it('should work correctly even with a miss', function( done ){
			var n = {foo:'bar'},
				t = [
					{foo:'eins'},
					{foo:'zwei'},
					n
				],
				feed = new Collection(t),
				child = feed.filter(function( d ){
					return d.foo[0] === 'a';
				});
		
			child.callStack([
				function(data){
					expect(data.length).to.equal(0);

					n.foo = 'eieio';
					feed.publish();
				},
				function(){
					expect(child.data.length).to.equal(0);

					done();
				}
			]);
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

			let feedCount = 0;
			feed.subscribe(
				() => {
					feedCount++;
				},
				err => {
					console.log('feed - error', err);
				}
			);

			let childCount = 0;
			child.subscribe(
				() => {
					childCount++;
				},
				err => {
					console.log('child - error', err);
				}
			);

			child.callStack([
				function(){
					expect( child.data.length ).to.equal( 3 );

					feed.add({foo:'eins'});
				},
				
				function(){
					expect( child.data.length ).to.equal( 4 );

					child.add({foo:'eins'});
				},
					
				function(){
					expect( child.data.length ).to.equal( 5 );

					child.destroy();

					done();
				}
			]);
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

			child.callStack([
				function(){
					expect(child.data.length).to.equal(3);

					a.merge({foo:'nope'});
				},
				function(res){
					expect(res.length).to.equal(2);

					done();
				}
			]);
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

			child.callStack([
				function(){
					expect(child.data.length).to.equal(1);

					feed.add({foo:'zoo'});
				},
				function(){
					expect(child.data.length).to.equal(1);

					feed.add({foo:'ever'});
				},
				function(){
					expect(child.data.length).to.equal(2);
					expect(feed.data.length).to.equal(5);
					expect(child.data[0].foo).to.equal('eins');

					feed.remove(feed.data[0]);
				},
				function(res){
					expect(child.data.length).to.equal(1);
					expect(feed.data.length).to.equal(4);
					expect(res[0].foo).to.equal('ever');

					done();
				}
			]);
		});
	});

	describe('::select', function(){
		it('should work correctly', function(done){
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

			child.callStack([
				() => {
					expect(child.data.length).to.equal(4);
			
					test.value = 'YeS';

					child.go();
				},
				data => {
					expect(data.length).to.equal( 2 );

					done();
				}
			]);
		});
	});

	describe('::paginate', function(){
		it('should work correctly', function(done){
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

			child.callStack([
				data => {
					expect( data.length ).to.equal( 2 );
					expect( child.nav.pos ).to.equal(0);
					expect( child.nav.start ).to.equal(0);
					expect( child.nav.stop ).to.equal(2);
					expect( child.nav.steps ).to.equal(4);
					expect( child.nav.count ).to.equal(7);
					expect( data[0].foo ).to.equal( 'eins' );

					child.nav.next();
				},
				data => {
					expect( data.length ).to.equal( 2 );
					expect( child.nav.pos ).to.equal(1);
					expect( child.nav.start ).to.equal(2);
					expect( child.nav.stop ).to.equal(4);
					expect( child.nav.steps ).to.equal(4);
					expect( child.nav.count ).to.equal(7);
					expect( data[0].foo ).to.equal( 'bar' );

					child.nav.next();
				},
				data => {
					expect( data.length ).to.equal( 2 );
					expect( data[0].foo ).to.equal( 'funf' );

					child.nav.next();
				},
				data => {
					expect( data.length ).to.equal( 1 );
					expect( child.nav.pos ).to.equal(3);
					expect( child.nav.start ).to.equal(6);
					expect( child.nav.stop ).to.equal(7);
					expect( child.nav.steps ).to.equal(4);
					expect( child.nav.count ).to.equal(7);
					expect( data[0].foo ).to.equal( 'sieben' );

					child.nav.prev();
				},

				() => {
					child.nav.prev();
				},
							
				data => {
					expect( data.length ).to.equal( 2 );
					expect( child.nav.pos ).to.equal(1);
					expect( child.nav.start ).to.equal(2);
					expect( child.nav.stop ).to.equal(4);
					expect( child.nav.steps ).to.equal(4);
					expect( child.nav.count ).to.equal(7);
					expect( data[0].foo ).to.equal( 'bar' );

					done();
				}
			]);
		});

		it('should allow goto an object', function(done){
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
			child.callStack([
				data => {
					let fired = false;
					
					let junk = child.callStack([
						() => {}, // each the one we're one
						() => {
							fired = true;
						}
					]);

					expect( data.length ).to.equal( 2 );
					expect( child.nav.pos ).to.equal(1);
					expect( child.nav.start ).to.equal(2);
					expect( child.nav.stop ).to.equal(4);
					expect( child.nav.steps ).to.equal(4);
					expect( child.nav.count ).to.equal(7);
					expect( data[0].foo ).to.equal( 'bar' );

					child.nav.goto(t[3]);

					setTimeout(() => {
						expect(fired).to.equal(false);
						junk.unsubscribe();

						expect( data.length ).to.equal( 2 );
						expect( child.nav.pos ).to.equal(1);
						expect( child.nav.start ).to.equal(2);
						expect( child.nav.stop ).to.equal(4);
						expect( child.nav.steps ).to.equal(4);
						expect( child.nav.count ).to.equal(7);
						expect( data[0].foo ).to.equal( 'bar' );

						child.nav.goto(t[5]);
					}, 5);
				},
				data => {
					expect( data.length ).to.equal( 2 );
					expect( child.nav.pos ).to.equal(2);
					expect( child.nav.start ).to.equal(4);
					expect( child.nav.stop ).to.equal(6);
					expect( child.nav.steps ).to.equal(4);
					expect( child.nav.count ).to.equal(7);
					expect( data[0].foo ).to.equal( 'funf' );

					child.nav.goto(t[6]);
				},
				data => {
					expect( data.length ).to.equal( 1 );
					expect( child.nav.pos ).to.equal(3);
					expect( child.nav.start ).to.equal(6);
					expect( child.nav.stop ).to.equal(7);
					expect( child.nav.steps ).to.equal(4);
					expect( child.nav.count ).to.equal(7);
					expect( data[0].foo ).to.equal( 'sieben' );

					// search for something out of the list
					child.nav.goto({});
				},			
				data => {
					expect( data.length ).to.equal( 2 );
					expect( child.nav.pos ).to.equal(0);
					expect( child.nav.start ).to.equal(0);
					expect( child.nav.stop ).to.equal(2);
					expect( child.nav.steps ).to.equal(4);
					expect( child.nav.count ).to.equal(7);
					expect( data[0].foo ).to.equal( 'eins' );

					done();
				}
			]);
		});

		it('should be able to be chained into', function(done){
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
				search = feed.select({
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
				}),
				child = search.paginate({
					size: 2
				});

			search.go();

			child.callStack([
				data => {
					expect( data.length ).to.equal( 2 );
					expect( child.nav.pos ).to.equal(0);
					expect( child.nav.start ).to.equal(0);
					expect( child.nav.stop ).to.equal(2);
					expect( child.nav.steps ).to.equal(4);
					expect( child.nav.count ).to.equal(7);
					expect( data[0].foo ).to.equal( 'eins' );
					
					test.value = 'Yes';

					search.go();
				},
				data => {
					expect( data.length ).to.equal( 2 );
					expect( child.nav.pos ).to.equal(0);
					expect( child.nav.start ).to.equal(0);
					expect( child.nav.stop ).to.equal(2);
					expect( child.nav.steps ).to.equal(2);
					expect( child.nav.count ).to.equal(3);
					expect( data[0].foo ).to.equal( 'eins' );

					child.nav.next();
				},	
				data => {
					expect( data.length ).to.equal( 1 );
					expect( child.nav.pos ).to.equal(1);
					expect( child.nav.start ).to.equal(2);
					expect( child.nav.stop ).to.equal(3);
					expect( child.nav.steps ).to.equal(2);
					expect( child.nav.count ).to.equal(3);
					expect( data[0].foo ).to.equal( 'funf' );

					done();
				}
			]);
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

			test.value = 'yes';

			feed.add({id:2, foo:'other', value:'yes'});

			child.on('next', function(){
				expect( bool ).to.equal( true );
				done();
			});
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

			parent.publish();
		});

		it('should work correctly', function(done){
			child.callStack([
				dex => {
					expect( dex.get(1) ).to.equal( parent.data[0] );
					expect( dex.get(2) ).to.equal( parent.data[1] );
					expect( dex.get(3) ).to.equal( parent.data[2] );
					expect( dex.get(4) ).to.be.undefined;

					parent.add({ 'type': 'dog', id:4 });
				},

				dex => {
					expect(dex.get(4)).to.equal( parent.data[3] );

					parent.remove(parent.data[1]);
				},

				dex => {
					expect( dex.get(2) ).to.be.undefined;

					done();
				}
			]);
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

		it('should take all elements from the parent', function(done){
			child.subscribe(dex => {
				expect( dex.get('dog').data.length ).to.equal( 2 );
				expect( dex.get('cat').data.length ).to.equal( 1 );

				done();
			});
		});

		it('should return back a collection even on a miss', function(done){
			child.subscribe(dex => {
				expect(dex.get('woot').data.length).to.equal(0);

				done();
			});
		});

		it('should route new elements to proper buckets', function(done){
			child.callStack([
				() => {
					parent.consume([
						{ 'type': 'dog', id:4 },
						{ 'type': 'cat', id:5 },
						{ 'type': 'monkey', id: 6 }
					]);
				},
				dex => {
					expect( dex.get('dog').data.length ).to.equal( 3 );
					expect( dex.get('cat').data.length ).to.equal( 2 );
					expect( dex.get('monkey').data.length ).to.equal( 1 );

					done();
				}
			]);
		});

		it('should properly reroute buckets', function( done ){
			let dog = 0;
			let pig = 0;

			child.callStack([
				dex => {
					let t = dex.get('dog').data[0];

					t.type = 'pig';

					dex.get('dog').subscribe(function(){
						dog++;
					});

					dex.get('pig').subscribe(function(){
						pig++;
					});

					parent.publish();
				},
				dex => {
					expect( dex.get('dog').data.length ).to.equal( 1 );
					expect( dex.get('dog').data[0].id ).to.equal( 3 );
					expect( dex.get('pig').data.length ).to.equal( 1 );
					expect( dex.get('pig').data[0].id ).to.equal( 1 );

					setTimeout(function(){
						expect( dog ).to.equal(3);
						expect( pig ).to.equal(2);

						done();
					}, 30);
				}
			]);
		});
	});
	
	describe('::promise', function(){
		it('should not fire if there is no data defined', function(done){
			const collection = new Collection();

			let promised = false;
			let subscribed = false;

			collection.subscribe(() => {
				subscribed = true;
			});

			collection.promise()
			.then(() => {
				promised = true;
			});

			setTimeout(function(){
				expect(promised).to.equal(false);
				expect(subscribed).to.equal(false);
				
				done();
			}, 100);
		});

		it('should fire if there is data defined', function(done){
			const collection = new Collection([
				{foo:'bar'}
			]);

			let promised = false;
			let subscribed = false;

			collection.subscribe(() => {
				subscribed = true;
			});

			collection.promise()
			.then(() => {
				promised = true;
			});

			setTimeout(function(){
				expect(promised).to.equal(true);
				expect(subscribed).to.equal(true);
				
				done();
			}, 100);
		});

		it('should fire if there is data is added', function(done){
			const collection = new Collection();

			let promised = false;
			let subscribed = false;

			collection.subscribe(() => {
				subscribed = true;
			});

			collection.promise()
			.then(() => {
				promised = true;
			});

			collection.add({
				foo: 'bar2'
			});

			setTimeout(function(){
				expect(promised).to.equal(true);
				expect(subscribed).to.equal(true);
				
				done();
			}, 500);
		});
	});
});
