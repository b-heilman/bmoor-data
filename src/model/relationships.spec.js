
const expect = require('chai').expect;

const {Model} = require('../Model.js');
const {Linker, Mapper, Network} = require('./relationships.js');

describe('bmoor-data::model/relationships.js', function(){
	describe('Mapper', function(){
		it('should properly instantiate', function(){
			const mapper = new Mapper();

			mapper.addLink('table-1', 'id', 'table-2', 'eins');
			mapper.addLink('table-1', 'other', 'table-2', 'eins');
			mapper.addLink('table-2', 'id', 'table-3', 'zwei');
			mapper.addLink('table-3', 'id', 'table-4', 'drei');
			mapper.addLink('table-4', 'eins', 'table-1', 'id');

			const table1 = mapper.getLink('table-1');
			const table2 = mapper.getLink('table-2');
			const table3 = mapper.getLink('table-3');
			const table4 = mapper.getLink('table-4');

			expect(table1.joins)
			.to.deep.equal([
				{'name':'table-2','local':'id','remote':'eins', 
					metadata: {
						direction: 'outgoing'
					}
				},
				{'name':'table-2','local':'other','remote':'eins', 
					metadata: {
						direction: 'outgoing'
					}
				},
				{'name':'table-4','local':'id','remote':'eins', 
					metadata: {
						direction: 'incoming'
					}
				}
			]);

			expect(table1.hash)
			.to.deep.equal({
				'table-2':[
					{'name':'table-2','local':'id','remote':'eins', 
						metadata: {
							direction: 'outgoing'
						}
					},
					{'name':'table-2','local':'other','remote':'eins', 
						metadata: {
							direction: 'outgoing'
						}
					}
				],
				'table-4':[
					{'name':'table-4','local':'id','remote':'eins', 
						metadata: {
							direction: 'incoming'
						}
					}
				]
			});

			expect(table2.joins)
			.to.deep.equal([
				{'name':'table-1','local':'eins','remote':'id', 
					metadata: {
						direction: 'incoming'
					}
				},
				{'name':'table-1','local':'eins','remote':'other', 
					metadata: {
						direction: 'incoming'
					}
				},
				{'name':'table-3','local':'id','remote':'zwei', 
					metadata: {
						direction: 'outgoing'
					}
				}
			]);

			expect(table2.hash)
			.to.deep.equal({
				'table-1':[
					{'name':'table-1','local':'eins','remote':'id', 
						metadata: {
							direction: 'incoming'
						}
					},
					{'name':'table-1','local':'eins','remote':'other', 
						metadata: {
							direction: 'incoming'
						}
					}
				],
				'table-3':[
					{'name':'table-3','local':'id','remote':'zwei', 
						metadata: {
							direction: 'outgoing'
						}
					}
				]
			});

			expect(table3.joins)
			.to.deep.equal([
				{'name':'table-2','local':'zwei','remote':'id', 
					metadata: {
						direction: 'incoming'
					}
				},
				{'name':'table-4','local':'id','remote':'drei', 
					metadata: {
						direction: 'outgoing'
					}
				}
			]);

			expect(table3.hash)
			.to.deep.equal({
				'table-2':[
					{'name':'table-2','local':'zwei','remote':'id', 
						metadata: {
							direction: 'incoming'
						}
					}
				],
				'table-4':[
					{'name':'table-4','local':'id','remote':'drei', 
						metadata: {
							direction: 'outgoing'
						}
					}
				]
			});

			expect(table4.joins)
			.to.deep.equal([
				{'name':'table-3','local':'drei','remote':'id', 
					metadata: {
						direction: 'incoming'
					}
				},
				{'name':'table-1','local':'eins','remote':'id', 
					metadata: {
						direction: 'outgoing'
					}
				}
			]);

			expect(table4.hash)
			.to.deep.equal({
				'table-3':[
					{'name':'table-3','local':'drei','remote':'id', 
						metadata: {
							direction: 'incoming'
						}
					}
				],
				'table-1':[
					{'name':'table-1','local':'eins','remote':'id', 
						metadata: {
							direction: 'outgoing'
						}
					}
				]
			});
		});

		describe('::getRelationships', function(){
			let mapper = null;

			beforeEach(function(){
				mapper = new Mapper();
			});

			it('pull in a singlar value', function(){
				const model1 = new Model('test-1', {
					fields: {
						eins: {
							update: false
						},
						zwei: {
							update: true,
							link: {
								name: 'test-2',
								field: 'id'
							}
						}
					}
				});

				const model2 = new Model('test-2', {
					fields: {
						id: {
							update: false
						}
					}
				});

				const model3 = new Model('test-3', {
					fields: {
						id: {
							update: false
						},
						zwei: {
							update: true,
							link: {
								name: 'test-2',
								field: 'id'
							}
						}
					}
				});

				mapper.addModel(model1);
				mapper.addModel(model2);
				mapper.addModel(model3);

				expect(mapper.getRelationships(model1))
				.to.deep.equal([{
					name: 'test-2',
					local: 'zwei',
					remote: 'id',
					metadata: {direction: 'outgoing'}
				}]);

				expect(mapper.getRelationships(model3))
				.to.deep.equal([{
					name: 'test-2',
					local: 'zwei',
					remote: 'id',
					metadata: {direction: 'outgoing'}
				}]);

				expect(mapper.getRelationships(model2))
				.to.deep.equal([{
					name: 'test-1',
					local: 'id',
					remote: 'zwei',
					metadata: {direction: 'incoming'}
				}, {
					name: 'test-3',
					local: 'id',
					remote: 'zwei',
					metadata: {direction: 'incoming'}
				}]);
			});
		});

		describe('::getRelationship', function(){
			let mapper = null;

			beforeEach(function(){
				mapper = new Mapper();
			});

			it('pull in a singlar value', function(){
				const model1 = new Model('test-1', {
					fields: {
						eins: {
							update: false
						},
						zwei: {
							update: true,
							link: {
								name: 'test-2',
								field: 'id'
							}
						}
					}
				});

				const model2 = new Model('test-2', {
					fields: {
						id: {
							update: false
						}
					}
				});

				mapper.addModel(model1);
				mapper.addModel(model2);

				expect(mapper.getRelationship(model1, 'test-2', 'zwei'))
				.to.deep.equal({
					name: 'test-2',
					local: 'zwei',
					remote: 'id',
					metadata: {direction: 'outgoing'}
				});
			});
		});

		describe('#getByDirection', function(){
			const mapper = new Mapper();

			// table-1 {id}
			mapper.addLink('table-2', 'einsId', 'table-1', 'id');
			mapper.addLink('table-4', 'einsId', 'table-1', 'id');
			mapper.addLink('table-3', 'zweiId', 'table-2', 'id');
			mapper.addLink('table-3', 'fierId', 'table-4', 'id');
			mapper.addLink('table-5', 'fierId', 'table-4', 'id');

			it('should let me get all incoming routes', function(){
				expect(mapper.getByDirection('table-1', 'incoming').map(t => t.name))
				.to.deep.equal(['table-2', 'table-4']);

				expect(mapper.getByDirection('table-1', 'outgoing').map(t => t.name))
				.to.deep.equal([]);

				expect(mapper.getByDirection('table-4', 'incoming').map(t => t.name))
				.to.deep.equal(['table-3', 'table-5']);

				expect(mapper.getByDirection('table-4', 'outgoing').map(t => t.name))
				.to.deep.equal(['table-1']);
			});
		});
	});

	describe('Linker', function(){
		it('should work with a linear path', function(){
			const mapper = new Mapper();

			mapper.addLink('table-1', 'id', 'table-2', 'eins');
			mapper.addLink('table-2', 'id', 'table-3', 'zwei');
			mapper.addLink('table-3', 'id', 'table-4', 'drei');

			const linker = new Linker(mapper, 'table-1');

			expect(linker.search('table-4', 3).map(t => t.name))
			.to.deep.equal(['table-1', 'table-2', 'table-3', 'table-4']);
		});

		it('should not search further than it needs to', function(){
			const mapper = new Mapper();

			mapper.addLink('table-1', 'id', 'table-2', 'eins');
			mapper.addLink('table-2', 'id', 'table-3', 'zwei');
			mapper.addLink('table-3', 'id', 'table-4', 'drei');

			const linker = new Linker(mapper, 'table-1');

			expect(linker.search('table-3', 3).map(t => t.name))
			.to.deep.equal(['table-1', 'table-2', 'table-3']);
		});

		it('should respect the limit', function(){
			const mapper = new Mapper();

			mapper.addLink('table-1', 'id', 'table-2', 'eins');
			mapper.addLink('table-2', 'id', 'table-3', 'zwei');
			mapper.addLink('table-3', 'id', 'table-4', 'drei');

			const linker = new Linker(mapper, 'table-1');

			expect(linker.search('table-4', 2))
			.to.equal(null);
		});

		it('should pick the shortest route', function(){
			const mapper = new Mapper();

			mapper.addLink('table-1', 'id', 'table-2', 'eins');
			mapper.addLink('table-2', 'id', 'table-3', 'zwei');
			mapper.addLink('table-3', 'id', 'table-4', 'drei');
			mapper.addLink('table-1', 'id', 'table-4', 'eins');

			const linker = new Linker(mapper, 'table-1');

			expect(linker.search('table-4', 3).map(t => t.name))
			.to.deep.equal(['table-1', 'table-4']);
		});

		it('should pick the shortest route - again', function(){
			const mapper = new Mapper();

			mapper.addLink('table-1', 'id', 'table-2', 'eins');
			mapper.addLink('table-2', 'id', 'table-3', 'zwei');
			mapper.addLink('table-3', 'id', 'table-4', 'drei');
			mapper.addLink('table-2', 'id', 'table-4', 'zwei');

			const linker = new Linker(mapper, 'table-1');

			expect(linker.search('table-4', 3).map(t => t.name))
			.to.deep.equal(['table-1', 'table-2', 'table-4']);
		});
	});

	describe('Network', function(){
		it('should pick the shortest route', function(){
			const mapper = new Mapper();

			mapper.addLink('table-1', 'id', 'table-2', 'eins');
			mapper.addLink('table-2', 'id', 'table-3', 'zwei');
			mapper.addLink('table-3', 'id', 'table-4', 'drei');
			mapper.addLink('table-1', 'id', 'table-4', 'eins');

			const network = new Network(mapper);

			expect(
				network.search(['table-1','table-2','table-4'], 3)
				.map(t => t.name)
			).to.deep.equal(['table-1', 'table-2', 'table-4']);
		});

		it('should work linearly', function(){
			const mapper = new Mapper();

			mapper.addLink('table-1', 'id', 'table-2', 'eins');
			mapper.addLink('table-2', 'id', 'table-3', 'zwei');
			mapper.addLink('table-3', 'id', 'table-4', 'drei');

			const network = new Network(mapper);

			expect(
				network.search(['table-1','table-2','table-4'], 3)
				.map(t => t.name)
			).to.deep.equal(['table-1', 'table-2', 'table-3', 'table-4']);
		});

		it('should pick the shortest route', function(){
			const mapper = new Mapper();

			mapper.addLink('table-1', 'id', 'table-2', 'eins');
			mapper.addLink('table-2', 'id', 'table-3', 'zwei');
			mapper.addLink('table-3', 'id', 'table-4', 'drei');
			mapper.addLink('table-1', 'id', 'table-4', 'eins');

			const network = new Network(mapper);

			expect(
				network.search(['table-1','table-3','table-4'], 3)
				.map(t => t.name)
			).to.deep.equal(['table-1', 'table-2', 'table-3', 'table-4']);
		});
	});
});
