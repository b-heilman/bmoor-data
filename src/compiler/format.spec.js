const {expect} = require('chai');

describe('bmoor-data.compiler.format', function () {
	const {compiler} = require('./format.js');

	describe('- Compiler', function () {
		it('should correctly tokenize', function () {
			expect(
				JSON.parse(
					JSON.stringify(compiler.tokenize('hello ${world} foo$bar')[0].tokens)
				)
			).to.deep.equal([
				{
					type: 'constant',
					metadata: null,
					value: 'hello '
				},
				{
					type: 'accessor',
					metadata: null,
					value: 'world'
				},
				{
					type: 'constant',
					metadata: null,
					value: ' foo$bar'
				}
			]);
		});

		it('should correctly compile', function () {
			expect(
				JSON.parse(
					JSON.stringify(
						compiler.compile(
							compiler.tokenize('hello ${world} foo$bar')[0].tokens
						).postfix
					)
				)
			).to.deep.equal([
				{type: 'value', method: 'stringValue'},
				{type: 'value', method: 'getter'},
				{type: 'operation', method: 'concat'},
				{type: 'value', method: 'stringValue'},
				{type: 'operation', method: 'concat'}
			]);
		});

		it('should correctly prepare', function () {
			const prepared = compiler.prepare('hello ${world} foo$bar');

			expect(
				prepared({
					world: 'this is a thing'
				})
			).to.deep.equal(['hello this is a thing foo$bar']);
		});
	});
});
