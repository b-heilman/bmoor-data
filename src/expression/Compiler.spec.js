const {expect} = require('chai');
const {Config, ConfigObject} = require('bmoor/src/lib/config.js');

const isCharacter = /[A-Za-z_0-9]/;

const {Token} = require('./Token.js');
const {Compound} = require('./Compound.js');

describe('bmoor-data.expression.compiler', function () {
	const {Compiler} = require('./Compiler.js');

	let parsingConfig = null;
	let compoundConfig = null;

	beforeEach(function () {
		parsingConfig = new Config({
			model: new ConfigObject({
				open: function (master, pos) {
					if (master[pos] === '$') {
						return {
							pos: pos + 1,
							begin: pos + 1
						};
					}
				},
				close: function (master, pos) {
					const ch = master[pos];

					if (isCharacter.test(ch)) {
						return false;
					}

					return {
						pos,
						end: pos - 1
					};
				},
				toToken: function (content) {
					return new Token('model', content);
				}
			}),

			accessor: new ConfigObject({
				open: function (master, pos) {
					if (master[pos] === '.') {
						return {
							pos: pos + 1,
							begin: pos + 1
						};
					}
				},
				close: function (master, pos) {
					const ch = master[pos];

					if (isCharacter.test(ch)) {
						return false;
					}

					return {
						pos,
						end: pos - 1
					};
				},
				toToken: function (content) {
					return new Token('accessor', content);
				}
			}),

			variable: new ConfigObject({
				open: function (master, pos) {
					if (master[pos] === '@') {
						return {
							pos: pos + 1,
							begin: pos + 1
						};
					}
				},
				close: function (master, pos) {
					const ch = master[pos];

					if (isCharacter.test(ch)) {
						return false;
					}

					return {
						pos,
						end: pos - 1
					};
				},
				toToken: function (content) {
					return new Token('variable', content);
				}
			}),

			junk: new ConfigObject({
				open: function (master, pos) {
					if (master[pos] === '>') {
						return {
							pos: pos + 1,
							begin: pos
						};
					}
				},
				close: function (master, pos) {
					const ch = master[pos];

					if (ch === '>') {
						return false;
					}

					return {
						pos,
						end: pos - 1
					};
				},
				toToken: function (content) {
					return new Token('junk', content);
				}
			})
		});

		compoundConfig = new Config({
			path: new ConfigObject({
				tokens: ['model', 'accessor'],
				factory: function (tokens) {
					return new Compound('path', tokens);
				}
			})
		});
	});

	describe('::tokenize', function () {
		let compiler = null;
		describe('with compounds', function () {
			beforeEach(function () {
				compiler = new Compiler(parsingConfig);
			});

			it('should work basically', function () {
				expect(
					JSON.parse(JSON.stringify(compiler.tokenize('$foo.bar')[0].tokens))
				).to.deep.equal([
					{
						type: 'model',
						metadata: null,
						value: 'foo'
					},
					{
						type: 'accessor',
						metadata: null,
						value: 'bar'
					}
				]);
			});

			it('should work with spaces', function () {
				expect(
					JSON.parse(
						JSON.stringify(compiler.tokenize('$foo .bar @token')[0].tokens)
					)
				).to.deep.equal([
					{
						type: 'model',
						metadata: null,
						value: 'foo'
					},
					{
						type: 'accessor',
						metadata: null,
						value: 'bar'
					},
					{
						type: 'variable',
						metadata: null,
						value: 'token'
					}
				]);
			});

			it('should work with junk leading', function () {
				expect(
					JSON.parse(
						JSON.stringify(compiler.tokenize('>>>> $foo .bar @token')[0].tokens)
					)
				).to.deep.equal([
					{
						type: 'junk',
						metadata: null,
						value: '>>>>'
					},
					{
						type: 'model',
						metadata: null,
						value: 'foo'
					},
					{
						type: 'accessor',
						metadata: null,
						value: 'bar'
					},
					{
						type: 'variable',
						metadata: null,
						value: 'token'
					}
				]);
			});

			it('should work with junk trailing', function () {
				expect(
					JSON.parse(
						JSON.stringify(compiler.tokenize('$foo .bar @token >>')[0].tokens)
					)
				).to.deep.equal([
					{
						type: 'model',
						metadata: null,
						value: 'foo'
					},
					{
						type: 'accessor',
						metadata: null,
						value: 'bar'
					},
					{
						type: 'variable',
						metadata: null,
						value: 'token'
					},
					{
						type: 'junk',
						metadata: null,
						value: '>>'
					}
				]);
			});

			it('should work with squashed', function () {
				expect(
					JSON.parse(
						JSON.stringify(compiler.tokenize('$foo.bar@token>>')[0].tokens)
					)
				).to.deep.equal([
					{
						type: 'model',
						metadata: null,
						value: 'foo'
					},
					{
						type: 'accessor',
						metadata: null,
						value: 'bar'
					},
					{
						type: 'variable',
						metadata: null,
						value: 'token'
					},
					{
						type: 'junk',
						metadata: null,
						value: '>>'
					}
				]);
			});
		});

		describe('without compounds', function () {
			beforeEach(function () {
				compiler = new Compiler(parsingConfig, null, compoundConfig);
			});

			it('should work basically', function () {
				expect(
					JSON.parse(JSON.stringify(compiler.tokenize('$foo.bar')[0].tokens))
				).to.deep.equal([
					{
						type: 'path',
						metadata: null,
						value: [
							{
								type: 'model',
								metadata: null,
								value: 'foo'
							},
							{
								type: 'accessor',
								metadata: null,
								value: 'bar'
							}
						]
					}
				]);
			});

			it('should work with spaces', function () {
				expect(
					JSON.parse(
						JSON.stringify(compiler.tokenize('$foo .bar @token')[0].tokens)
					)
				).to.deep.equal([
					{
						type: 'path',
						metadata: null,
						value: [
							{
								type: 'model',
								metadata: null,
								value: 'foo'
							},
							{
								type: 'accessor',
								metadata: null,
								value: 'bar'
							}
						]
					},
					{
						type: 'variable',
						metadata: null,
						value: 'token'
					}
				]);
			});

			it('should work basically', function () {
				expect(
					JSON.parse(
						JSON.stringify(compiler.tokenize('>>>>$foo.bar')[0].tokens)
					)
				).to.deep.equal([
					{
						type: 'junk',
						metadata: null,
						value: '>>>>'
					},
					{
						type: 'path',
						metadata: null,
						value: [
							{
								type: 'model',
								metadata: null,
								value: 'foo'
							},
							{
								type: 'accessor',
								metadata: null,
								value: 'bar'
							}
						]
					}
				]);
			});

			it('should work with spaces', function () {
				expect(
					JSON.parse(
						JSON.stringify(compiler.tokenize('$foo .bar @token>>>>')[0].tokens)
					)
				).to.deep.equal([
					{
						type: 'path',
						metadata: null,
						value: [
							{
								type: 'model',
								metadata: null,
								value: 'foo'
							},
							{
								type: 'accessor',
								metadata: null,
								value: 'bar'
							}
						]
					},
					{
						type: 'variable',
						metadata: null,
						value: 'token'
					},
					{
						type: 'junk',
						metadata: null,
						value: '>>>>'
					}
				]);
			});

			it('should work squashed', function () {
				expect(
					JSON.parse(
						JSON.stringify(compiler.tokenize('$foo.bar@token>>>>')[0].tokens)
					)
				).to.deep.equal([
					{
						type: 'path',
						metadata: null,
						value: [
							{
								type: 'model',
								metadata: null,
								value: 'foo'
							},
							{
								type: 'accessor',
								metadata: null,
								value: 'bar'
							}
						]
					},
					{
						type: 'variable',
						metadata: null,
						value: 'token'
					},
					{
						type: 'junk',
						metadata: null,
						value: '>>>>'
					}
				]);
			});
		});
	});
});
