describe('bmoor-data.Composite', function(){
	var Node = bmoorData.Composite;

	it('should allow the node to refer back top the root', function(){
		var root = {},
			node = new Node( root, '$node' );

		expect( node.getRoot() ).toBe( root );
		expect( root.$node ).toBe( node );

		node.merge( {foo:'bar'} );

		expect( root.foo ).toBe('bar')
	});
});