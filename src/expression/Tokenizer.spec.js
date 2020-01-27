
const {expect} = require('chai');

describe('bmoor-data.Tokenizer', function(){
	const {Tokenizer} = require('./Tokenizer.js');

	it('should be defined', function(){
		expect(Tokenizer).to.exist;
	});

	describe('single parsing', function(){
		const tokenizer = new Tokenizer();

		it('should work for blocks', function(){
			tokenizer.tokenize('(like, this)');

			expect(JSON.parse(JSON.stringify(tokenizer.tokens)))
			.to.deep.equal([{
				'type': 'block',
				'value': 'like, this'
			}]);
		});

		it('should work for operations', function(){
			tokenizer.tokenize('&&');

			expect(JSON.parse(JSON.stringify(tokenizer.tokens)))
			.to.deep.equal([{
				'type': 'operation',
				'value': '&&'
			}]);
		});

		it('should work for methods', function(){
			tokenizer.tokenize('method(of, some, kind)');

			expect(JSON.parse(JSON.stringify(tokenizer.tokens)))
			.to.deep.equal([{
				'type': 'method',
				'value': 'method(of, some, kind)'
			}]);
		});

		it('should work for number (int)', function(){
			tokenizer.tokenize('123');

			expect(JSON.parse(JSON.stringify(tokenizer.tokens)))
			.to.deep.equal([{
				'type': 'number',
				'value': 123
			}]);
		});

		it('should work for number (float)', function(){
			tokenizer.tokenize('123.23');

			expect(JSON.parse(JSON.stringify(tokenizer.tokens)))
			.to.deep.equal([{
				'type': 'number',
				'value': 123.23
			}]);
		});

		it('should work for string (")', function(){
			tokenizer.tokenize('"foo-bar it\'s"');

			expect(JSON.parse(JSON.stringify(tokenizer.tokens)))
			.to.deep.equal([{
				'type': 'string',
				'value': 'foo-bar it\'s'
			}]);
		});

		it('should work for string (\')', function(){
			tokenizer.tokenize(`'foo-bar it\\'s that\\'s'`);

			expect(JSON.parse(JSON.stringify(tokenizer.tokens)))
			.to.deep.equal([{
				'type': 'string',
				'value': 'foo-bar it\'s that\'s'
			}]);
		});

		it('should work for string (`)', function(){
			tokenizer.tokenize('`foo-bar it\'s`');

			expect(JSON.parse(JSON.stringify(tokenizer.tokens)))
			.to.deep.equal([{
				'type': 'string',
				'value': 'foo-bar it\'s'
			}]);
		});
	});

	describe('mixed parsing', function(){
		const tokenizer = new Tokenizer();

		it('should work without operators', function(){
			tokenizer.tokenize(
				'(like, this) boo (hello & world) "bar" 123  23.45'
			);

			expect(JSON.parse(JSON.stringify(tokenizer.tokens)))
			.to.deep.equal([{
				'type': 'block',
				'value': 'like, this'
			},{
				'type': 'method',
				'value': 'boo'
			},{
				'type': 'block',
				'value': 'hello & world'
			},{
				'type': 'string',
				'value': 'bar'
			},{
				'type': 'number',
				'value': 123
			},{
				'type': 'number',
				'value': 23.45
			}]);
		});

		it('should parse a method', function(){
			tokenizer.tokenize(
				'drump(like, 123)boo blah(hello & world)'
			);

			expect(JSON.parse(JSON.stringify(tokenizer.tokens)))
			.to.deep.equal([{
				'type': 'method',
				'value': 'drump(like, 123)'
			},{
				'type': 'method',
				'value': 'boo'
			},{
				'type': 'method',
				'value': 'blah(hello & world)'
			}]);
		});

		it('should parse operations with this', function(){
			tokenizer.tokenize(
				'$foo.bar && $hello.world || 123 > $eins'
			);

			expect(JSON.parse(JSON.stringify(tokenizer.tokens)))
			.to.deep.equal([{
				'type': 'accessor',
				'value': 'foo.bar'
			},{
				'type': 'operation',
				'value': '&&'
			},{
				'type': 'accessor',
				'value': 'hello.world'
			},{
				'type': 'operation',
				'value': '||'
			},{
				'type': 'number',
				'value': 123
			},{
				'type': 'operation',
				'value': '>'
			},{
				'type': 'accessor',
				'value': 'eins'
			}]);
		});

		it('should work without spaces', function(){
			tokenizer.tokenize(
				'$foo.bar&&$hello.world||123>$eins'
			);

			expect(JSON.parse(JSON.stringify(tokenizer.tokens)))
			.to.deep.equal([{
				'type': 'accessor',
				'value': 'foo.bar'
			},{
				'type': 'operation',
				'value': '&&'
			},{
				'type': 'accessor',
				'value': 'hello.world'
			},{
				'type': 'operation',
				'value': '||'
			},{
				'type': 'number',
				'value': 123
			},{
				'type': 'operation',
				'value': '>'
			},{
				'type': 'accessor',
				'value': 'eins'
			}]);
		});
	});
});
