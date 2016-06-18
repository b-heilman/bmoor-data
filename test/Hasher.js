describe('bmoor-data.Hasher', function(){
	var Hasher = bmoorData.Hasher;

	it('should be able to translate data objects', function(){
		var hasher = new Hasher(['eins','zwei']);

		expect( hasher.name ).toBe('eins-zwei');
		expect( hasher.canFulfill({eins:1,zwei:2}) ).toBe( true );
		expect( hasher.canFulfill({eins:1}) ).toBe( false );
		expect( hasher.hash({eins:1,zwei:2}) ).toBe('1::2');
		expect( hasher.hash({eins:1}) ).toBe('1::undefined');
	});

	it('should be able to translate multi-tiered data objects', function(){
		var hasher = new Hasher(['eins.one','zwei.two']),
			t = {eins:{one:1},zwei:{two:2}},
			t2 = {eins:{one:1}};

		expect( hasher.name ).toBe('eins.one-zwei.two');
		expect( hasher.canFulfill(t) ).toBe( true );
		expect( hasher.canFulfill(t2) ).toBe( false );
		expect( hasher.hash(t) ).toBe('1::2');
		expect( hasher.hash(t2) ).toBe('1::undefined');
	});
});