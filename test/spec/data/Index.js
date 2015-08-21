describe( 'bmoor.data.Index', function(){
	var Index;

	beforeEach(bMoor.test.injector(['bmoor.data.Index', function( I ){
		Index = I;
	}]));

	describe( 'complex indexes on one attribute', function(){
		var index, v1, v2, v3;

		beforeEach(function(){
			index = new Index( 'woot' );
			v1 = { woot : 'eins', status : 1 };
			v2 = { woot : 'zwei', status : 2 };
			v3 = { woot : 'eins', status : 3 };

			index.$insert( v1 );
			index.$insert( v2 );
			index.$insert( v3 );
		});

		it( 'should group collisons and singles', function(){
			expect( index.select(v1).length ).toBe( 2 );
			expect( index.select({woot:'zwei'})[0].status ).toBe( 2 );
		});

		it( 'should return back empty collections on miss', function(){
			expect( index.select({woot:'dupe'}).length ).toBe( 0 );
		});
	});

	describe( 'complex indexes on many attributes', function(){
		var index, v1, v2, v3;

		beforeEach(function(){
			index = new Index( ['woot','status'] );
			v1 = { woot : 'eins', status : 1 };
			v2 = { woot : 'zwei', status : 2 };
			v3 = { woot : 'eins', status : 1 };

			index.$insert( v1 );
			index.$insert( v2 );
			index.$insert( v3 );
		});

		it( 'should group collisons and singles', function(){
			expect( index.select(v1).length ).toBe( 2 );
			expect( index.select({woot:'zwei',status:2})[0].status ).toBe( 2 );
		});

		it( 'should return back empty collections on miss', function(){
			expect( index.select({woot:'dupe',status:1}).length ).toBe( 0 );
			expect( index.select({status:1}).length ).toBe( 0 );
			expect( index.select({woot:'eins'}).length ).toBe( 0 );
		});
	});
});