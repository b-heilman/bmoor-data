describe('bmoor-data.Collection', function(){
	var Collection = bmoorData.Collection;

	it('should be defined', function(){
		expect( Collection ).toBeDefined();
	});

	it('should mixin Eventing', function(){
		expect( (new Collection()).on ).toBeDefined();
	});

	it('should fire an insert event on push', function(){
		var t = new Collection(),
			obj = {},
			called = false;

		t.on('insert', function( ins ){
			called = true;
			expect( ins ).toBe( obj );
		});

		t.push(obj);

		expect( t.length ).toBe( 1 );
		expect( called ).toBe( true );
	});

	it('should fire an insert event on unshift', function(){
		var t = new Collection(),
			obj = {},
			called = false;

		t.on('insert', function( ins ){
			called = true;
			expect( ins ).toBe( obj );
		});

		t.unshift(obj);

		expect( t.length ).toBe( 1 );
		expect( called ).toBe( true );
	});

	it('should fire an insert event on insert', function(){
		var t = new Collection(),
			obj = {},
			called = false;

		t.on('insert', function( ins ){
			called = true;
			expect( ins ).toBe( obj );
		});

		t.insert( obj );

		expect( t.length ).toBe( 1 );
		expect( called ).toBe( true );
	});

	it('should fire an remove event on pop', function(){
		var t = new Collection(),
			obj = {},
			called = false;

		t.on('remove', function( ins ){
			called = true;
			expect( ins ).toBe( obj );
		});

		t.insert( obj );
		t.pop();

		expect( t.length ).toBe( 0 );
		expect( called ).toBe( true );
	});

	it('should fire an remove event on shift', function(){
		var t = new Collection(),
			obj = {},
			called = false;

		t.on('remove', function( ins ){
			called = true;
			expect( ins ).toBe( obj );
		});

		t.insert( obj );
		t.shift();

		expect( t.length ).toBe( 0 );
		expect( called ).toBe( true );
	});

	it('should fire an remove event on remove', function(){
		var t = new Collection(),
			obj = {},
			called = false;

		t.on('remove', function( ins ){
			called = true;
			expect( ins ).toBe( obj );
		});

		t.insert( obj );
		t.remove( obj );

		expect( t.length ).toBe( 0 );
		expect( called ).toBe( true );
	});

	it('should allow one collection to follow another', function(){
		var t = {},
			a = new Collection(),
			b = new Collection();

		b.follow( a );

		a.insert( t );

		expect( b.get(0) ).toBe( t );
	});

	it('should allow one collection to unfollow another', function(){
		var t = {},
			a = new Collection(),
			b = new Collection();

		b.follow( a );
		b.unfollow( a );

		a.insert( t );

		expect( b.length ).toBe( 0 );
	});

	it('should inherit the functionality from Array', function(){
		var t = {},
			a = new Collection(),
			b;

		a.insert( t );

		b = a.slice(0);

		expect( b[0] ).toBe( t );
	});

	it('should create a child collection with $filter', function(){
		var child,
			a = new Collection(),
			t = {type:1, value:1};

		a.insert({type:1, value:2});
		a.insert({type:2, value:3});

		child = a.$filter(function( a ){ return a.type === 1; }),

		expect( child.length ).toBe( 1 );

		a.insert( t );

		expect( child.length ).toBe( 2 );

		t.$observe.update({type:3});

		expect( child.length ).toBe( 1 );
		expect( child[0].value ).toBe( 2 );
	});

	it('should create a child collection with $filter', function(){
		var a = new Collection(),
			b = new Collection(),
			c = a.$concat( b );

		a.insert({value:0});
		b.insert({value:1});

		expect( c.length ).toBe( 1 );
	});
});