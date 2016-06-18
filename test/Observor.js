describe('bmoor-data.Observor', function(){
	var Datum = bmoorData.Observor;

	it('should allow the node to refer back top the root', function(){
		var t = { foo: 'bar' },
			root = {},
			node = new Datum( root, '$node' ),
			called = false;

		node.on('update', function( obj ){
			called = true;
			expect( obj ).toBe( t );
		});
		node.update( t );

		expect( root.foo ).toBe('bar');
		expect( called ).toBe( true );
	});
});