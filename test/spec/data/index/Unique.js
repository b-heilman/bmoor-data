describe( 'bmoor.data.index.Unique', function(){
	var Index;

	beforeEach(bMoor.test.injector(['bmoor.data.index.Unique', function( I ){
		Index = I;
	}]));

	describe( 'unique indexes', function(){
		var index, 
			v1, 
			v2, 
			v3;

		beforeEach(function(){
			index = new Index( 'woot' );
			v1 = { woot : 'eins', status : 1 };
			v2 = { woot : 'zwei', status : 2 };
			v3 = { woot : 'eins', status : 3 };
			index.$insert( v1 );
			index.$insert( v2 );
			index.$insert( v3 );
		});

		it( 'should only allow one instance', function(){
			expect( index.select(v1).status ).toBe( 3 );
			expect( index.select({woot:'zwei'}).status ).toBe( 2 );
		});
	});

	describe( 'unique complex indexes', function(){
		var index, v1, v2, v3;

		beforeEach(function(){
			index = new Index( ['woot','status'] );
			v1 = { woot : 'eins', status : 1 };
			v2 = { woot : 'zwei', status : 2 };
			v3 = { woot : 'eins', status : 3 };

			index.$insert( v1 );
			index.$insert( v2 );
			index.$insert( v3 );
		});

		it( 'should only allow one instance', function(){
			expect( index.select(v1).status ).toBe( 1 );
			expect( index.select({woot:'zwei',status:2}).status ).toBe( 2 );
		});
	});
});