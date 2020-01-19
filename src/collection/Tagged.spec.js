
const {expect} = require('chai');

describe('bmoor-data.collection.Tagged', function(){
	var {Tagged} = require('./Tagged.js');

	it('should be defined', function(){
		expect( Tagged ).to.exist;
	});

	describe('::choose', function(){
		it('should work with tags correctly', function(){
			var feed = new Tagged(),
				test = {
					value: 'YeS'
				},
				child = feed.choose({
					normalizeContext: function(){
						return test.value.toLowerCase();
					},
					normalizeDatum: function( datum ){
						return { value: datum.value.toLowerCase() };
					},
					tests: [
						function( datum, ctx ){
							return datum.value === ctx;
						}
					]
				});
			
			feed.add({id:1, foo:'eins'},{value:'yes'});
			feed.add({id:3, foo:'zwei'},{value:'no'});
			feed.add({id:2, foo:'bar'},{value:'no'});
			feed.add({id:4, foo:'fier'},{value:'YES'});

			feed.publish();
			
			expect(child.data.length).to.equal(2);
		});
	});
});
