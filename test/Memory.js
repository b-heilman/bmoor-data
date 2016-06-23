describe('bmoor-data.Memory', function(){
	var Hasher = bmoorData.Hasher,
		Memory = bmoorData.Memory,
		mem;

	describe('without a lifetime', function(){
		beforeEach(function(){
			mem = new Memory( new Hasher(['id']), 3 );
		});

		it('should insert elements in order', function(){
			var t = { id: 100, value: 100 },
				t2 = { id: 200, value: 200 };

			mem.insert( t );
			mem.insert( t2 );

			expect( mem.length ).toBe( 2 );
			expect( mem.head.prev ).toBeUndefined();
			expect( mem.head.next.$datum.value ).toBe( 200 );
			expect( mem.first().value ).toBe( 200 );
			expect( mem.get(0).value ).toBe( 200 );

			expect( mem.tail.next ).toBeUndefined();
			expect( mem.tail.prev.$datum.value ).toBe( 100 );
			expect( mem.last().value ).toBe( 100 );
			expect( mem.get(1).value ).toBe( 100 );
		});

		it('should maintain the limit', function(){
			var i, c;

			for( i = 0, c = 20; i < c; i++ ){
				mem.insert( {id:i,value:i+1} );
			}

			expect( mem.length ).toBe( 3 );
			expect( mem.first().value ).toBe( 20 );
			expect( mem.last().value ).toBe( 18 );
		});
	});

	describe('without a lifetime', function(){
		beforeEach(function(){
			mem = new Memory( new Hasher(['id']), 3, 5 );
		});

		it('should insert elements in order', function( done ){
			var t = { id: 100, value: 100 },
				t2 = { id: 200, value: 200 };

			mem.insert( t );
			mem.insert( t2 );

			expect( mem.length ).toBe( 2 );

			setTimeout(function(){
				expect( mem.length ).toBe( 2 );
			}, 3);

			setTimeout(function(){
				expect( mem.length ).toBe( 0 );
				done();
			}, 6);
		});
	});
});