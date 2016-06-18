describe('bmoor-data.Table', function(){
	var Table = bmoorData.Table,
		Observor = bmoorData.Observor;

	describe('using primary', function(){
		var t,
			table;

		beforeEach(function(){
			t = {id:4,type:3,value:4};
			table = new Table(['id']);

			table.insert({id:1,type:1,value:1});
			table.insert({id:2,type:2,value:2});
			table.insert({id:3,type:1,value:3});
			
			table.insert( t );
			table.insert({id:5,type:2,value:5});
		});

		it('should allow you to set up a primary index', function(){
			expect( table.primary.get(3).value ).toBe( 4 );

			table.publish({id:4,type:3,value:1});

			expect( table.primary.get(3).value ).toBe( 1 );
			expect( table.select({type:3}).get(0).value ).toBe( 1 );

			t.$observe.update({type:2,value:10});

			expect( t.value ).toBe( 10 );
			expect( table.primary.get(3).value ).toBe( 10 );
			
			expect( table.select({type:2}).get(2).value ).toBe( 10 );
		});

		it('should route to proper filters', function(){
			expect( table.primary.length ).toBe(5);
			
			expect( table.select({id:1}).value ).toBe(1);
			expect( table.select({type:1}).length ).toBe(2);
			expect( table.select({type:2}).get(1).value ).toBe(5);
		});
	});

	describe('not using primary', function(){

	});
});