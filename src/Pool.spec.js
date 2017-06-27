describe('bmoor-data.Pool', function(){
	var Feed = bmoorData.Feed,
		Pool = bmoorData.Pool;

	it('should be defined', function(){
		expect( Pool ).toBeDefined();
	});

	it('should copy values correctly', function( done ){
		var agg = new Pool(),
			feed = new Feed();

		agg.on('update', function(){
			expect( agg.data[0]._ ).toBe( 0 );
			expect( agg.data[0].to ).toBe( 1 );
			done();
		});

		agg.addFeed( feed, 'index', { 'to' : 'from' } );

		feed.add({
			index: 0,
			from: 1
		});
	});

	it('should copy multi-tiered values correctly', function( done ){
		var agg = new Pool(),
			feed = new Feed();

		agg.on('update', function(){
			expect( agg.data[0]._ ).toBe( 0 );
			expect( agg.data[0].to.here ).toBe( 1 );
			done();
		});

		agg.addFeed( feed, 'index', { 'to.here' : 'from.here' } );

		feed.add({
			index: 0,
			from: {
				here: 1
			}
		});
	});

	it('should copy and update values correctly', function( done ){
		var count = 0,
			agg = new Pool(),
			feed = new Feed();

		agg.addFeed( feed, 'index', { 'to' : 'from' } );

		feed.add({
			index: 0,
			from: 1
		});

		agg.on('update', function(){
			expect( agg.data[0]._ ).toBe( 0 );
			expect( agg.data[0].to ).toBe( 2 );
			done();
		});

		feed.add({
			index: 0,
			from: 2
		});
	});
});