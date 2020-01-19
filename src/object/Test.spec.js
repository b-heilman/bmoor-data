
const {expect} = require('chai');

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

			expect( filter.go({valid:0}) ).to.equal( false );
			expect( filter.go({valid:1}) ).to.equal( true );
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

			expect( filter.hash ).to.equal( 'boo=bar:eins.zwei=hello' );

			expect( filter.go({
				boo: 'bar',
				eins: {
					zwei: 'hello'
				}
			}) ).to.equal( true );

			expect( filter.go({
				boo: 'bar',
				eins: {
					zwei: 'hello',
					world: 'false'
				}
			}) ).to.equal( true );

			expect( filter.go({
				boo: 'bar2',
				eins: {
					zwei: 'hello',
					world: 'false'
				}
			}) ).to.equal( false );

			expect( filter.go({
				boo: 'bar2',
				eins: {
					zwei: 'hello',
					world: 'false'
				}
			}) ).to.equal( false );

			expect( filter.go({
				boo: 'bar',
				eins: {
					zwei: false
				}
			}) ).to.equal( false );

			expect( filter.go({
				boo: 'bar'
			}) ).to.equal( false );
		});

		it('should match on undefined', function(){
			var filter = new Test({
					foo: {
						bar: undefined
					}
				});

			expect( filter.hash ).to.equal( 'foo.bar=undefined' );

			expect( filter.go({
			}) ).to.equal( true );

			expect( filter.go({
				foo: true
			}) ).to.equal( true );

			expect( filter.go({
				foo: {
					bar: true
				}
			}) ).to.equal( false );
		});

		it('should allow massaging', function(){
			var filter = new Test({ foo: 'bar'},
				{
					massage: function( d ){
						return d.info;
					}
				});

			expect( filter.hash ).to.equal( 'foo=bar' );

			expect( filter.go({
				foo: 'bar'
			}) ).to.equal( false );

			expect( filter.go({
				info: {foo:'bar'}
			}) ).to.equal( true );

			expect( filter.go({
				info: { foo: { bar: true } }
			}) ).to.equal( false );
		});
	});
});
