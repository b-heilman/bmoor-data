describe('bmoor-data.collection.Proxied', function(){
	var Proxied = require('./Proxied.js'),
		DataProxy = require('../object/Proxy.js');

	it('should be defined', function(){
		expect( Proxied ).toBeDefined();
	});

	it('should wrap data in a proxy', function(){
		var feed = new Proxied();

		feed.add({id:1, foo:'eins'});
		
		expect( feed.data[0] instanceof DataProxy ).toBe( true );
	});

	describe('proxy methods', function(){
		describe('::mergeChanges', function(){
			it('should reduce correctly', function(){
				var feed = new Proxied();

				feed.add({id:1, foo:'eins'});
				feed.add({id:2, foo:'zwei'});

				feed.data[1].getMask().foo = 'bar';

				expect(feed.mergeChanges()).toEqual([
					{id: 1, foo:'eins'},
					{id: 2, foo:'bar'}
				]);
			});
		});

		describe('::flattenAll', function(){
			it('should reduce correctly', function(){
				var feed = new Proxied();

				feed.add({id:1, foo:'eins'});
				feed.add({id:2, foo:'zwei'});

				feed.data[1].getMask().foo = 'bar';

				expect( feed.flattenAll() ).toEqual([
					{id: 1, foo:'eins'},
					{id: 2, foo:'bar'}
				]);
			});
		});
	});

	describe('::filter', function(){
		it('should work with proxies correctly', function( done ){
			var n = {foo:'bar'},
				t = [
					{foo:'eins'},
					{foo:'zwei'},
					n
				],
				feed = new Proxied(t),
				child = feed.filter(
					function( d ){
						return d.foo[0] === 'e';
					}
				);

			child.callStack([
				function(){
					expect( child.data.length ).toBe( 1 );

					feed.add({foo:'zoo'});
				},
				function(){
					expect( child.data.length ).toBe( 1 );
					expect( feed.data.length ).toBe( 4 );

					feed.add({foo:'ever'});
				},
				function(){
					expect( child.data.length ).toBe( 2 );
					expect( feed.data.length ).toBe( 5 );
					expect( child.data[0].$('foo') ).toBe('eins');

					feed.remove( feed.data[0].getDatum() );
				},
				function(){
					expect( child.data.length ).toBe( 1 );
					expect( feed.data.length ).toBe( 4 );
					expect( child.data[0].$('foo') ).toBe('ever');

					done();
				}
			]);
		});

		it('should allow a datum to be passed between', function(done){
			var proxy = new DataProxy({v:true});
			var t = [
				new DataProxy({v:true}),
				new DataProxy({v:false}),
				new DataProxy({v:true}),
				new DataProxy({v:false}),
				proxy
			];
			var collection = new Proxied(t);
			var truthy = collection.filter({v:true});
			var falsey = collection.filter({v:false});

			collection._next();

			expect(truthy.data.length).toBe(3);
			expect(falsey.data.length).toBe(2);

			proxy.merge({v:false});

			collection._next();

			expect(truthy.data.length).toBe(2);
			expect(falsey.data.length).toBe(3);

			done();
		});
	});

	describe('::index', function(){
		var child,
			parent;

		beforeEach(function(){
			parent = new Proxied([
				{ type: 'dog', id: 1 },
				{ type: 'cat', id: 2 },
				{ type: 'dog', id: 3 }
			]);
			child = parent.index(function( d ){
				return d.id;
			});
		});

		it('should work corectly with proxies', function(){
			child.subscribe(dex => {
				expect( dex.get(1) ).toBe( parent.data[0] );
				expect( dex.get(2) ).toBe( parent.data[1] );
				expect( dex.get(3) ).toBe( parent.data[2] );
				expect( dex.get(4) ).toBeUndefined();
			});
		});
	});

	/*
	describe('::route', function(){
		var child,
			parent;

		beforeEach(function(){
			parent = new Proxied([
				{ type: 'dog', id: 1 },
				{ type: 'cat', id: 2 },
				{ type: 'dog', id: 3 }
			]);
			child = parent.route(function( d ){
				return d.type;
			});
		});

		it('should work with proxies correctly', function(){
			expect( child.get('dog').data.length ).toBe( 2 );
			expect( child.get('cat').data.length ).toBe( 1 );
		});
	});
	*/

	describe('::select', function(){
		it('should work with proxies correctly', function(done){
			var t = [
					{id:1, foo:'eins',value:'yes'},
					{id:3, foo:'zwei',value:'no'},
					{id:2, foo:'bar',value:'no'},
					{id:4, foo:'fier',value:'YES'}
				],
				feed = new Proxied(t),
				test = {},
				child = feed.select({
					massage: function( proxy ){
						return proxy.getDatum();
					},
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
				data => {
					expect(data.length).toBe(4);
			
					test.value = 'YeS';

					child.go();
				},
				data => {
					expect(data.length).toBe(2);

					done();
				}
			]);
		});

		it('should work with proxies correctly not defining own massage', function(done){
			var t = [
					{id:1, foo:'eins',value:'yes'},
					{id:3, foo:'zwei',value:'no'},
					{id:2, foo:'bar',value:'no'},
					{id:4, foo:'fier',value:'YES'}
				],
				feed = new Proxied(t),
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
				data => {
					expect(data.length).toBe(4);
			
					test.value = 'YeS';

					child.go();
				},
				data => {
					expect(data.length).toBe(2);

					done();
				}
			]);
		});
	});
});
