describe('bmoor-data::Test', function(){

	var Test = require('./Test.js');

	describe('functions as options',function(){
		it('should work', function(){
			var filter = new Test(function( obj ){
					if ( obj.valid ){
						return true;
					}else{
						return false;
					}
				});

			expect( filter.go({valid:0}) ).toBe( false );
			expect( filter.go({valid:1}) ).toBe( true );
		});
	});

	describe('objects as options', function(){
		it('should match on sub properties', function(){
			var filter = new Test({
					boo: 'bar',
					eins: {
						zwei: 'hello'
					}
				});

			expect( filter.go({
				boo: 'bar',
				eins: {
					zwei: 'hello'
				}
			}) ).toBe( true );

			expect( filter.go({
				boo: 'bar',
				eins: {
					zwei: 'hello',
					world: 'false'
				}
			}) ).toBe( true );

			expect( filter.go({
				boo: 'bar2',
				eins: {
					zwei: 'hello',
					world: 'false'
				}
			}) ).toBe( false );

			expect( filter.go({
				boo: 'bar2',
				eins: {
					zwei: 'hello',
					world: 'false'
				}
			}) ).toBe( false );

			expect( filter.go({
				boo: 'bar',
				eins: {
					zwei: false
				}
			}) ).toBe( false );

			expect( filter.go({
				boo: 'bar'
			}) ).toBe( false );
		});

		it('should match on undefined', function(){
			var filter = new Test({
					foo: {
						bar: undefined
					}
				});

			expect( filter.go({
			}) ).toBe( true );

			expect( filter.go({
				foo: true
			}) ).toBe( true );

			expect( filter.go({
				foo: {
					bar: true
				}
			}) ).toBe( false );
		});
	});
});
