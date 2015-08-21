describe('bmoor.data.Feed', function(){
	var Feed,
		Test;

	beforeEach(bMoor.test.injector(
		['bmoor.data.Feed',
		function( C ){
			Feed = C;
		}]
	));

	it('should be defined', function(){
		expect( Feed ).toBeDefined();
	});
});