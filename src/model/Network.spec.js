
const expect = require('chai').expect;

const {Mapper} = require('./Mapper.js');
const {Network} = require('./Network.js');

	describe('bmoor-data::/mode/Network', function(){
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