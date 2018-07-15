describe('bmoor-data.structure.Model', function(){
	var Model = require('./Model.js').Model;

	it('should be defined', function(){
		expect( Model ).toBeDefined();
	});

	describe('.properties', function(){
		it('should expand default properties correctly', function(){
			var model = new Model('foo-bar', {
					schema: 'test-1',
					properties: {
						'eins': true,
						'zwei': false,
						'drei': null,
						'fier': {
							read: false,
							write: true,
							update: false
						}
					}
				});

			expect( model.properties ).toEqual({
				eins: {
					read: true,
					write: true,
					update: true
				},
				zwei: {
					read: false,
					write: false,
					update: false
				},
				drei: {
					read: true,
					write: false,
					update: false
				},
				fier: {
					read: false,
					write: true,
					update: false
				}
			});

			expect( model.selectFields ).toEqual([
				'eins',
				'drei'
			]);

			expect( model.createFields ).toEqual([
				'eins',
				'fier'
			]);

			expect( model.updateFields ).toEqual([
				'eins'
			]);
		});
	});

	describe('::getMapping', function(){
		it('should properly construct a mapping tree', function(){
			var model = new Model('foo-bar', {
					schema: 'test-1',
					properties: {
						'eins': {
							read: true,
							write: false,
							update: false
						}
					},
					relationships: {
						'foo-bar-2': {
							type: 'toMany',
							key: 'fooBar2Id',
							model: 'foo-bar-2',
							foreignKey: 'id',
							through: [{
								model: 'via-1',
								incoming: 'in1',
								outgoing: 'out2'
							},{
								model: 'via-2',
								incoming: 'in2',
								outgoing: 'out3'
							}]
						}
					}
				});

			expect( model.getJoin('foo-bar-2').path ).toEqual([{
				fromModel: 'foo-bar',
				fromKey: 'fooBar2Id',
				toModel: 'via-1',
				toKey: 'in1'
			},{
				fromModel: 'via-1',
				fromKey: 'out2',
				toModel: 'via-2',
				toKey: 'in2'
			},{
				fromModel: 'via-2',
				fromKey: 'out3',
				toModel: 'foo-bar-2',
				toKey: 'id'
			}]);
		});

		it('should be fine without through', function(){
			var model = new Model('foo-bar', {
					schema: 'test-1',
					properties: {
						'eins': {
							read: true,
							write: false,
							update: false
						}
					},
					relationships: {
						'foo-bar-2': {
							type: 'toMany',
							key: 'fooBar2Id',
							model: 'foo-bar-2',
							foreignKey: 'id'
						}
					}
				});

			expect( model.getJoin('foo-bar-2').path ).toEqual([{
				fromModel: 'foo-bar',
				fromKey: 'fooBar2Id',
				toModel: 'foo-bar-2',
				toKey: 'id'
			}]);
		});
	});
});