describe('bmoor-data::Hash', function(){

	var Hash = require('./Hash.js');

	describe('basic setup',function(){
		it('should work with a function', function(){
			var index = new Hash(function( obj ){
					if ( obj.valid ){
						return true;
					}else{
						return false;
					}
				});

			expect( index.go({valid:0}) ).toBe( false );
			expect( index.go({valid:1}) ).toBe( true );
			expect( index.go('10:20') ).toBe( '10:20' );
		});

		it('should work with an object function', function(){
			var index = new Hash({'eins':1,'zwei':2});

			expect( index.hash ).toBe('eins:zwei');
			expect( index.go({eins:1,zwei:2}) ).toBe( '1:2' );
			expect( index.go({eins:10,zwei:20}) ).toBe( '10:20' );
			expect( index.go('10:20') ).toBe( '10:20' );
		});

		it('should work with an object function, ignoring order', function(){
			var index = new Hash({'zwei':2,'eins':1});

			expect( index.hash ).toBe('eins:zwei');
			expect( index.go({eins:1,zwei:2}) ).toBe( '1:2' );
			expect( index.go({eins:10,zwei:20}) ).toBe( '10:20' );
			expect( index.go('10:20') ).toBe( '10:20' );
		});

		it('should work with a multi level object function', function(){
			var index = new Hash({'eins':{'foo':1},'zwei':{'bar':2}});

			expect( index.hash ).toBe('eins.foo:zwei.bar');
			expect( index.go({eins:{foo:1},zwei:{bar:2}}) ).toBe( '1:2' );
			expect( index.go({eins:{foo:10},zwei:{bar:20}}) ).toBe( '10:20' );
			expect( index.go('10:20') ).toBe( '10:20' );
		});

		it('should work with an array', function(){
			var index = new Hash(['eins','zwei']);

			expect( index.hash ).toBe('eins:zwei');
			expect( index.go({eins:1,zwei:2}) ).toBe( '1:2' );
			expect( index.go({eins:10,zwei:20}) ).toBe( '10:20' );
			expect( index.go('10:20') ).toBe( '10:20' );
		});
	});
});
