
const {expect} = require('chai');

describe('bmoor-data.Normalized', function(){
	const {Normalized} = require('./Normalized.js');
	
	it('should inflate a singular expression correctly', function(){
		const schema = new Normalized({
			expressions: [{
				type: 'string',
				path: 'foo',
				operator: '==',
				value: 'bar',
			}],
			joinType: 'and'
		});

		const eb = schema.buildBlock();

		expect(eb.toJSON())
		.to.deep.equal([
			{ type: 'value', method: '' },
			{ type: 'value', method: 'stringValue' },
			{ type: 'operation', method: 'equals' }
		]);

		expect(
			eb.eval({
				foo: 'bar'
			})
		).to.equal(true);

		expect(
			eb.eval({
				foo: 'bar2'
			})
		).to.equal(false);
	});

	it('should inflate a multiple expressions correctly', function(){
		const schema = new Normalized({
			expressions: [{
				type: 'string',
				path: 'foo',
				operator: '==',
				value: 'bar',
			}, {
				type: 'string',
				path: 'hello',
				operator: '==',
				value: 'world',
			}],
			joinType: 'and'
		});

		const eb = schema.buildBlock();

		expect(eb.toJSON())
		.to.deep.equal([
			{ type: 'value', method: '' },
			{ type: 'value', method: 'stringValue' },
			{ type: 'operation', method: 'equals' },
			{ type: 'value', method: '' },
			{ type: 'value', method: 'stringValue' },
			{ type: 'operation', method: 'equals' },
			{ type: 'operation', method: 'and' }
		]);

		expect(
			eb.eval({
				foo: 'bar'
			})
		).to.equal(false);

		expect(
			eb.eval({
				foo: 'bar',
				hello: 'world'
			})
		).to.equal(true);

		expect(
			eb.eval({
				foo: 'bar2',
				hello: 'world'
			})
		).to.equal(false);
	});

	it('should allow prepare', function(){
		const schema = new Normalized({
			expressions: [{
				type: 'string',
				path: 'foo',
				operator: '==',
				value: 'bar',
			}, {
				type: 'string',
				path: 'hello',
				operator: '==',
				value: 'world',
			}],
			joinType: 'and'
		});

		const eb = schema.buildBlock();

		expect(eb.toJSON())
		.to.deep.equal([
			{ type: 'value', method: '' },
			{ type: 'value', method: 'stringValue' },
			{ type: 'operation', method: 'equals' },
			{ type: 'value', method: '' },
			{ type: 'value', method: 'stringValue' },
			{ type: 'operation', method: 'equals' },
			{ type: 'operation', method: 'and' }
		]);

		const fn = eb.prepare();
		expect(
			fn({
				foo: 'bar'
			})
		).to.equal(false);

		expect(
			fn({
				foo: 'bar',
				hello: 'world'
			})
		).to.equal(true);

		expect(
			fn({
				foo: 'bar2',
				hello: 'world'
			})
		).to.equal(false);
	});
	
	it('should allow multiple fromSchema statements', function(){
		const schema = new Normalized({
			expressions: [{
				type: 'string',
				path: 'foo',
				operator: '==',
				value: 'bar',
			}],
			joinType: 'and'
		});

		const eb = schema.buildBlock();

		schema.joinSchema({
			expressions: [{
				type: 'string',
				path: 'hello',
				operator: '==',
				value: 'world',
			}],
			joinType: 'and'
		}, 'or');

		expect(eb.toJSON())
		.to.deep.equal([
			{ type: 'value', method: '' },
			{ type: 'value', method: 'stringValue' },
			{ type: 'operation', method: 'equals' },
			[
				{ type: 'value', method: '' },
				{ type: 'value', method: 'stringValue' },
				{ type: 'operation', method: 'equals' }
			],
			{ type: 'operation', method: 'or' }
		]);

		const fn = eb.prepare();
		expect(
			fn({
				foo: 'bar'
			})
		).to.equal(true);

		expect(
			fn({
				foo: 'bar',
				hello: 'world'
			})
		).to.equal(true);

		expect(
			fn({
				foo: 'bar2',
				hello: 'world'
			})
		).to.equal(true);

		expect(
			fn({
				foo: 'bar2',
				hello: 'world2'
			})
		).to.equal(false);
	});

	it('should inflate a singular block correctly', function(){
		const schema = new Normalized({
			blocks: [{
				expressions: [{
					type: 'string',
					path: 'foo',
					operator: '==',
					value: 'bar'
				}],
				joinType: 'and'
			}],
			joinType: 'and'
		});

		const eb = schema.buildBlock();

		expect(eb.toJSON())
		.to.deep.equal([
			[
				{ type: 'value', method: '' },
				{ type: 'value', method: 'stringValue' },
				{ type: 'operation', method: 'equals' }
			]
		]);

		expect(
			eb.eval({
				foo: 'bar'
			})
		).to.equal(true);

		expect(
			eb.eval({
				foo: 'bar2'
			})
		).to.equal(false);
	});
});
