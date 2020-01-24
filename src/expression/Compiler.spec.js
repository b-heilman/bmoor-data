
const {expect} = require('chai');

describe('bmoor-data.Compiler', function(){
	const {ExpressionBlock} = require('./Compiler.js');

	it('should be defined', function(){
		expect(ExpressionBlock).to.exist;
	});

	it('should inflate a singular expression correctly', function(){
		const eb = new ExpressionBlock();

		eb.fromSchema({
			expressions: [{
				type: 'string',
				path: 'foo',
				operator: 'equals',
				value: 'bar',
			}],
			joinType: 'and'
		});

		expect(eb.toJSON())
		.to.deep.equal([
			{ type: 'access', method: '' },
			{ type: 'access', method: 'stringValue' },
			{ type: 'pair', method: 'equals' }
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
		const eb = new ExpressionBlock();

		eb.fromSchema({
			expressions: [{
				type: 'string',
				path: 'foo',
				operator: 'equals',
				value: 'bar',
			}, {
				type: 'string',
				path: 'hello',
				operator: 'equals',
				value: 'world',
			}],
			joinType: 'and'
		});

		expect(eb.toJSON())
		.to.deep.equal([
			{ type: 'access', method: '' },
			{ type: 'access', method: 'stringValue' },
			{ type: 'pair', method: 'equals' },
			{ type: 'access', method: '' },
			{ type: 'access', method: 'stringValue' },
			{ type: 'pair', method: 'equals' },
			{ type: 'pair', method: 'and' }
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
		const eb = new ExpressionBlock();

		eb.fromSchema({
			expressions: [{
				type: 'string',
				path: 'foo',
				operator: 'equals',
				value: 'bar',
			}, {
				type: 'string',
				path: 'hello',
				operator: 'equals',
				value: 'world',
			}],
			joinType: 'and'
		});

		expect(eb.toJSON())
		.to.deep.equal([
			{ type: 'access', method: '' },
			{ type: 'access', method: 'stringValue' },
			{ type: 'pair', method: 'equals' },
			{ type: 'access', method: '' },
			{ type: 'access', method: 'stringValue' },
			{ type: 'pair', method: 'equals' },
			{ type: 'pair', method: 'and' }
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
		const eb = new ExpressionBlock();

		eb.fromSchema({
			expressions: [{
				type: 'string',
				path: 'foo',
				operator: 'equals',
				value: 'bar',
			}],
			joinType: 'and'
		});

		eb.fromSchema({
			expressions: [{
				type: 'string',
				path: 'hello',
				operator: 'equals',
				value: 'world',
			}],
			joinType: 'and'
		}, 'or');

		expect(eb.toJSON())
		.to.deep.equal([
			{ type: 'access', method: '' },
			{ type: 'access', method: 'stringValue' },
			{ type: 'pair', method: 'equals' },
			{ type: 'access', method: '' },
			{ type: 'access', method: 'stringValue' },
			{ type: 'pair', method: 'equals' },
			{ type: 'pair', method: 'or' }
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
});
