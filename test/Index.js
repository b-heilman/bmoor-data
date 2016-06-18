describe('bmoor-data.Index', function(){
	var Hasher = bmoorData.Hasher,
		Index = bmoorData.Index,
		Observor = bmoorData.Observor;

	it('should be insert an object and select its collection', function(){
		var hasher = new Hasher(['eins','zwei']),
			index = new Index(hasher),
			t = {eins:1,zwei:2};

		expect( index.insert(t) ).toBeTruthy();
		expect( index.select({eins:1,zwei:2}).length ).toBe( 1 );
	});

	it('should be automatically push insertions to corresponding collection', function(){
		var hasher = new Hasher(['eins','zwei']),
			index = new Index(hasher),
			collection = index.select({eins:1,zwei:2}),
			t = {eins:1,zwei:2};

		expect( index.insert(t) ).toBeTruthy();
		expect( collection.length ).toBe( 1 );
	});

	it('should be automatically remove from corresponding collection', function(){
		var hasher = new Hasher(['eins','zwei']),
			index = new Index(hasher),
			collection = index.select({eins:1,zwei:2}),
			t = {eins:1,zwei:2};

		expect( index.insert(t) ).toBeTruthy();
		expect( index.remove(t) ).toBeTruthy();
		expect( collection.length ).toBe( 0 );
	});

	it('should ignore removals of nodes not in the index', function(){
		var hasher = new Hasher(['eins','zwei']),
			index = new Index(hasher),
			collection = index.select({eins:1,zwei:2}),
			t = {eins:1,zwei:2};

		expect( index.insert(t) ).toBeTruthy();
		expect( index.remove({eins:1,zwei:2}) ).toBeFalsy();
		expect( collection.length ).toBe( 1 );
	});

	it('should update a node that is already indexed', function(){
		var hasher = new Hasher(['eins','zwei']),
			index = new Index(hasher),
			collection1 = index.select({eins:1,zwei:2}),
			collection2 = index.select({eins:1,zwei:3}),
			t = {eins:1,zwei:2};

		index.insert( t );

		expect( collection1.length ).toBe( 1 );

		t.zwei = 3;

		index.insert( t );

		expect( collection1.length ).toBe( 0 );
		expect( collection2.length ).toBe( 1 );
	});

	it('should hook on an observer', function(){
		var index = new Index( new Hasher(['index']) ),
			t1 = {index:1,value:1},
			t2 = {index:2,value:2},
			collection1 = index.select({index:1}),
			collection2 = index.select({index:2});

		index.insert( t1 );
		index.insert( t2 );

		expect( collection1.length ).toBe( 1 );
		expect( collection2.length ).toBe( 1 );

		t1.index = 2;
		t1.$observe.trigger('update',null);

		expect( collection1.length ).toBe( 0 );
		expect( collection2.length ).toBe( 2 );

		t2.$observe.update({index:1,value:10});

		expect( collection1.length ).toBe( 1 );
		expect( collection1.get(0).value ).toBe( 10 );
		expect( collection2.length ).toBe( 1 );
	});

	it('should allow a generic hashing object', function(){
		var index = new Index({
				hash: function( obj ){
					return obj.eins+'-'+obj.zwei;
				},
				canFulfill: function( obj ){
					return true;
				}
			}),
			collection1 = index.select({eins:1,zwei:2}),
			collection2 = index.select({eins:1,zwei:3}),
			t = {eins:1,zwei:2};

		index.insert( t );

		expect( collection1.length ).toBe( 1 );

		t.zwei = 3;
		index.insert( t );

		expect( collection1.length ).toBe( 0 );
		expect( collection2.length ).toBe( 1 );
	});
});