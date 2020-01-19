
const {expect} = require('chai');

describe('bmoor-data.collection.Proxied', function(){
	const {Proxied} = require('./Proxied.js');
	const {Proxy: DataProxy} = require('../object/Proxy.js');

	it('should be defined', function(){
		expect( Proxied ).to.exist;
	});

	it('should wrap data in a proxy', function(){
		var feed = new Proxied();

		feed.add({id:1, foo:'eins'});
		
		expect( feed.data[0] instanceof DataProxy ).to.equal( true );
	});

	describe('proxy methods', function(){
		describe('::mergeChanges', function(){
			it('should reduce correctly', function(){
				var feed = new Proxied();

				feed.add({id:1, foo:'eins'});
				feed.add({id:2, foo:'zwei'});

				feed.data[1].getMask().foo = 'bar';

				expect(feed.mergeChanges()).to.deep.equal([
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

				expect( feed.flattenAll() ).to.deep.equal([
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
					expect( child.data.length ).to.equal( 1 );

					feed.add({foo:'zoo'});
				},
				function(){
					expect( child.data.length ).to.equal( 1 );
					expect( feed.data.length ).to.equal( 4 );

					feed.add({foo:'ever'});
				},
				function(){
					expect( child.data.length ).to.equal( 2 );
					expect( feed.data.length ).to.equal( 5 );
					expect( child.data[0].$('foo') ).to.equal('eins');

					feed.remove( feed.data[0].getDatum() );
				},
				function(){
					expect( child.data.length ).to.equal( 1 );
					expect( feed.data.length ).to.equal( 4 );
					expect( child.data[0].$('foo') ).to.equal('ever');

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

			collection.publish();

			expect(truthy.data.length).to.equal(3);
			expect(falsey.data.length).to.equal(2);

			proxy.merge({v:false});

			collection.publish();

			expect(truthy.data.length).to.equal(2);
			expect(falsey.data.length).to.equal(3);

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
				expect( dex.get(1) ).to.equal( parent.data[0] );
				expect( dex.get(2) ).to.equal( parent.data[1] );
				expect( dex.get(3) ).to.equal( parent.data[2] );
				expect( dex.get(4) ).to.be.undefined;
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
			expect( child.get('dog').data.length ).to.equal( 2 );
			expect( child.get('cat').data.length ).to.equal( 1 );
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
					expect(data.length).to.equal(4);
			
					test.value = 'YeS';

					child.go();
				},
				data => {
					expect(data.length).to.equal(2);

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
					expect(data.length).to.equal(4);
			
					test.value = 'YeS';

					child.go();
				},
				data => {
					expect(data.length).to.equal(2);

					done();
				}
			]);
		});
	});

	describe('chaining', function(){
		it('should allow ::sorted ::index', function(){
			const collection = new Proxied([
				{dex: 4, val: 1},
				{dex: 5, val: 2},
				{dex: 1, val: 3},
				{dex: 2, val: 1},
				{dex: 3, val: 2},
				{dex: 6, val: 3},
			]);

			const sorted = collection.sorted((a, b) => {
				return a.$('dex') - b.$('dex');
			});

			sorted.subscribe(data => {
				expect(data.length).to.equal(6);
				expect(data[0].$('dex')).to.equal(1);
				expect(data[5].$('dex')).to.equal(6);
			});

			sorted.filter(p => p.dex%2 === 0)
			.subscribe(data => {
				expect(data.length).to.equal(3);
				expect(data[0].$('dex')).to.equal(2);
			});

			sorted.filter({val: 1})
			.subscribe(data => {
				expect(data.length).to.equal(2);
				expect(data[0].$('dex')).to.equal(2);
			});
		});
	});
});
