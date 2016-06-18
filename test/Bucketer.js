describe('bmoor-data.Bucketer', function(){
	var Hasher = bmoorData.Hasher,
		Bucketer = bmoorData.Bucketer;

	it('should fire the call backs on creation and deletion', function(){
		var bucketer = new Bucketer( 
				new Hasher(['index']),
				function( collection, obj ){
					if ( collection.$value ){
						collection.$value += obj.value;
					}else{
						collection.$value = obj.value;
					}
				},
				function( collection, obj ){
					collection.$value -= obj.value;
				}
			),
			bucket1 = bucketer.select({index:1}),
			bucket2 = bucketer.select({index:2}),
			t = {index:1, value:3};

		bucketer.insert( t );

		expect( bucket1.$value ).toBe( 3 );

		bucketer.insert( {index:1, value:4} );

		expect( bucket1.$value ).toBe( 7 );

		t.index = 2;
		bucketer.insert( t );

		expect( bucket1.$value ).toBe( 4 );
		expect( bucket2.$value ).toBe( 3 );
	});
});