describe('bmoor-data.stream.Converter', function(){
	var Feed = bmoorData.Collection,
		Converter = bmoorData.stream.Converter;

	it('should be defined', function(){
		expect( Converter ).toBeDefined();
	});

	it('should copy values correctly', function( done ){
		var feed = new Feed(),
			convert = new Converter();

		convert.setArrayCriteria([
			function( arr ){
				// won't neccisarily be a normal array
				expect( arr[0] ).toEqual( {x:0} );
				expect( arr[1] ).toEqual( {x:1} );
				expect( arr.length ).toBe( 2 );
				return [{x:2}];
			},
			function( arr ){
				expect( arr ).toEqual( [{x:2}] );
				return [{x:3}];
			}
		]);

		convert.setDatumCriteria([
			function( datum ){
				expect( datum ).toEqual({x:3});
				datum.y = true;
				return datum;
			},
			function( datum, orig ){
				expect( datum ).toEqual({x:3,y:true});
				return {z:100};
			},
			function( datum, orig ){
				datum.t = 200;
				return datum;
			}
		]);

		convert.on('insert', function(){
			expect( convert.data ).toEqual( [{z:100,t:200}] );
			done();
		});

		feed.add({
			x: 0
		});

		feed.add({
			x: 1
		});

		convert.setFeed( feed );
	});
});