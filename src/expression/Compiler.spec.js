
const {expect} = require('chai');

describe('bmoor-data.expression.Compiler', function(){
	const {tokenize, compile, prepare} = require('./Compiler.js');
	
	describe('::tokenize', function(){
		describe('single parsing', function(){
			it('should work for blocks', function(){
				expect(JSON.parse(JSON.stringify(
					tokenize('(like, this)').tokens
				))).to.deep.equal([{
					'type': 'block',
					'metadata': null,
					'value': 'like, this'
				}]);
			});

			it('should work for operations', function(){
				expect(JSON.parse(JSON.stringify(
					tokenize('&&').tokens
				))).to.deep.equal([{
					'type': 'operation',
					'metadata': null,
					'value': '&&'
				}]);
			});

			it('should work for methods', function(){
				expect(JSON.parse(JSON.stringify(
					tokenize('method(of, some, kind)').tokens
				))).to.deep.equal([{
					'type': 'method',
					'metadata': null,
					'value': 'method(of, some, kind)'
				}]);
			});

			it('should work for number (int)', function(){
				expect(JSON.parse(JSON.stringify(
					tokenize('123').tokens
				))).to.deep.equal([{
					'type': 'constant',
					'metadata': {
						subtype: 'number'
					},
					'value': 123
				}]);
			});

			it('should work for number (float)', function(){
				expect(JSON.parse(JSON.stringify(
					tokenize('123.23').tokens
				))).to.deep.equal([{
					'type': 'constant',
					'metadata': {
						subtype: 'number'
					},
					'value': 123.23
				}]);
			});

			it('should work for string (")', function(){
				expect(JSON.parse(JSON.stringify(
					tokenize('"foo-bar it\'s"').tokens
				))).to.deep.equal([{
					'type': 'constant',
					'metadata': {
						subtype: 'string'
					},
					'value': 'foo-bar it\'s'
				}]);
			});

			it('should work for string (\')', function(){
				expect(JSON.parse(JSON.stringify(
					tokenize(`'foo-bar it\\'s that\\'s'`).tokens
				))).to.deep.equal([{
					'type': 'constant',
					'metadata': {
						subtype: 'string'
					},
					'value': 'foo-bar it\'s that\'s'
				}]);
			});

			it('should work for string (`)', function(){
				expect(JSON.parse(JSON.stringify(
					tokenize('`foo-bar it\'s`').tokens
				))).to.deep.equal([{
					'type': 'constant',
					'metadata': {
						subtype: 'string'
					},
					'value': 'foo-bar it\'s'
				}]);
			});
		});

		describe('mixed parsing', function(){
			it('should work without operators', function(){
				expect(JSON.parse(JSON.stringify(
					tokenize('(like, this) boo (hello & world) "bar" 123  23.45').tokens
				))).to.deep.equal([{
					'type': 'block',
					'metadata': null,
					'value': 'like, this'
				},{
					'type': 'method',
					'metadata': null,
					'value': 'boo'
				},{
					'type': 'block',
					'metadata': null,
					'value': 'hello & world'
				},{
					'type': 'constant',
					'metadata': {
						subtype: 'string'
					},
					'value': 'bar'
				},{
					'type': 'constant',
					'metadata': {
						subtype: 'number'
					},
					'value': 123
				},{
					'type': 'constant',
					'metadata': {
						subtype: 'number'
					},
					'value': 23.45
				}]);
			});

			it('should parse a method', function(){
				expect(JSON.parse(JSON.stringify(
					tokenize('drump(like, 123)boo blah(hello & world)').tokens
				))).to.deep.equal([{
					'type': 'method',
					'metadata': null,
					'value': 'drump(like, 123)'
				},{
					'type': 'method',
					'metadata': null,
					'value': 'boo'
				},{
					'type': 'method',
					'metadata': null,
					'value': 'blah(hello & world)'
				}]);
			});

			it('should parse operations with this', function(){
				expect(JSON.parse(JSON.stringify(
					tokenize('$foo.bar && $hello.world || 123 > $eins').tokens
				))).to.deep.equal([{
					'type': 'accessor',
					'metadata': null,
					'value': 'foo.bar'
				},{
					'type': 'operation',
					'metadata': null,
					'value': '&&'
				},{
					'type': 'accessor',
					'metadata': null,
					'value': 'hello.world'
				},{
					'type': 'operation',
					'metadata': null,
					'value': '||'
				},{
					'type': 'constant',
					'metadata': {
						subtype: 'number'
					},
					'value': 123
				},{
					'type': 'operation',
					'metadata': null,
					'value': '>'
				},{
					'type': 'accessor',
					'metadata': null,
					'value': 'eins'
				}]);
			});

			it('should work without spaces', function(){
				expect(JSON.parse(JSON.stringify(
					tokenize('$foo.bar&&$hello.world||123>$eins').tokens
				))).to.deep.equal([{
					'type': 'accessor',
					'metadata': null,
					'value': 'foo.bar'
				},{
					'type': 'operation',
					'metadata': null,
					'value': '&&'
				},{
					'type': 'accessor',
					'metadata': null,
					'value': 'hello.world'
				},{
					'type': 'operation',
					'metadata': null,
					'value': '||'
				},{
					'type': 'constant',
					'metadata': {
						subtype: 'number'
					},
					'value': 123
				},{
					'type': 'operation',
					'metadata': null,
					'value': '>'
				},{
					'type': 'accessor',
					'metadata': null,
					'value': 'eins'
				}]);
			});
		});
	});

	describe('::compile', function(){
		it('should hopefully work - 1', function(){
			expect(JSON.parse(JSON.stringify(
				compile(tokenize('$a+$b*$c-$d/$e').tokens).postfix
			))).to.deep.equal([
				{ type: 'value', method: '' },
				{ type: 'value', method: '' },
				{ type: 'value', method: '' },
				{ type: 'operation', method: 'mult' },
				{ type: 'operation', method: 'add' },
				{ type: 'value', method: '' },
				{ type: 'value', method: '' },
				{ type: 'operation', method: 'div' },
				{ type: 'operation', method: 'sub' }
			]);
		});

		it('should hopefully work - 2', function(){
			expect(JSON.parse(JSON.stringify(
				compile(tokenize('$a*$b+$c*$d').tokens).postfix
			))).to.deep.equal([
				{ type: 'value', method: '' },
				{ type: 'value', method: '' },
				{ type: 'operation', method: 'mult' },
				{ type: 'value', method: '' },
				{ type: 'value', method: '' },
				{ type: 'operation', method: 'mult' },
				{ type: 'operation', method: 'add' }
			]);
		});
	});

	describe('::prepare', function(){
		const prepared = prepare('$a+4 == $b || $c + 3 > $d - 5');

		expect(prepared({
			a: 1,
			b: 5,
			c: 2,
			d: 20
		})).to.equal(true);

		expect(prepared({
			a: 10,
			b: 5,
			c: 2,
			d: 20
		})).to.equal(false);

		expect(prepared({
			a: 10,
			b: 5,
			c: 10,
			d: 15
		})).to.equal(false);
	});
});
