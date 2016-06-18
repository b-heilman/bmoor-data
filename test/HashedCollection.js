describe('bmoor-data.HashedCollection', function(){
	var HashedCollection = bmoorData.HashedCollection,
		Hasher = bmoorData.Hasher;

	it('should allow an index to be used to merge Collection nodes', function(){
		var feed = new HashedCollection( new Hasher(['index']) );

		feed.insert( {index:1, value:3} );

		expect( feed.get(0).value ).toBe( 3 );

		feed.select( {index:1} ).$observe.update({value:1});
		expect( feed.get(0).value ).toBe( 1 );
	});

	it('should call merge of the base object', function(){
		var called = false,
			feed = new HashedCollection( new Hasher(['index']) ),
			t = {
				index:1,
				value:3, 
				merge:function( obj ){
					called = true;
					expect( obj ).toBe( t2 );
				}
			},
			t2 = {
				index:1,
				value:1
			};

		feed.insert( t );

		expect( feed.get(0).value ).toBe( 3 );

		feed.update( t2 );

		expect( called ).toBe( true );
	});
});