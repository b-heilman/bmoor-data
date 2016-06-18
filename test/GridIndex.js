describe('bmoor-data.GridIndex', function(){
	var GridIndex = bmoorData.GridIndex;

	describe('basic insertion', function(){
		var index = new GridIndex({xMin:0,xMax:100,yMin:0,yMax:100},10);

		function xIntercepts( datum, x ){
			return ( datum.xMin <= x && datum.xMax >= x );
		}

		function yIntercepts( datum, y ){
			return ( datum.yMin <= y && datum.yMax >= y );
		}

		function getBox( datum ){
			return datum;
		}

		index.insert( {xMin:5,xMax:15,yMin:5,yMax:15}, getBox, xIntercepts, yIntercepts );

		it('should intersect on low edge', function(){
			expect( index.check(5,5).length ).toBe( 1 );
			expect( index.checkX(5).length ).toBe( 1 );
			expect( index.checkY(5).length ).toBe( 1 );
		});
		
		it('should intersect', function(){
			expect( index.check(10,10).length ).toBe( 1 );
			expect( index.checkX(10).length ).toBe( 1 );
			expect( index.checkY(10).length ).toBe( 1 );
		});

		it('should intersect on high edge', function(){
			expect( index.check(15,15).length ).toBe( 1 );
			expect( index.checkX(15).length ).toBe( 1 );
			expect( index.checkY(15).length ).toBe( 1 );
		});

		it('should miss low', function(){
			expect( index.check(4,4).length ).toBe( 0 );
			expect( index.checkX(4).length ).toBe( 0 );
			expect( index.checkY(4).length ).toBe( 0 );
		});

		it('should miss high', function(){
			expect( index.check(16,16).length ).toBe( 0 );
			expect( index.checkX(16).length ).toBe( 0 );
			expect( index.checkY(16).length ).toBe( 0 );
		});
	});

	it('should handle multiple blocks', function(){
		var index = new GridIndex({xMin:0,xMax:100,yMin:0,yMax:100},10);

		function xIntercepts( datum, x ){
			return ( datum.xMin <= x && datum.xMax >= x );
		}

		function yIntercepts( datum, y ){
			return ( datum.yMin <= y && datum.yMax >= y );
		}

		function getBox( datum ){
			return datum;
		}

		index.insert( {xMin:0,xMax:30,yMin:0,yMax:30,value:1}, getBox, xIntercepts, yIntercepts );
		index.insert( {xMin:0,xMax:30,yMin:70,yMax:100,value:2}, getBox, xIntercepts, yIntercepts );
		index.insert( {xMin:70,xMax:100,yMin:70,yMax:100,value:3}, getBox, xIntercepts, yIntercepts );
		index.insert( {xMin:70,xMax:100,yMin:0,yMax:30,value:4}, getBox, xIntercepts, yIntercepts );
		index.insert( {xMin:40,xMax:60,yMin:40,yMax:60,value:5}, getBox, xIntercepts, yIntercepts );
		index.insert( {xMin:20,xMax:50,yMin:20,yMax:50,value:5}, getBox, xIntercepts, yIntercepts );

		expect( index.check(25,25).length ).toBe( 2 );
		expect( index.checkX(25).length ).toBe( 3 );
		expect( index.checkY(25).length ).toBe( 3 );
	});
});
