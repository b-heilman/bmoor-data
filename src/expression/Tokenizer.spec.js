
const {expect} = require('chai');

describe('bmoor-data.Tokenizer', function(){
	const {Tokenizer} = require('./Tokenizer.js');

	it('should be defined', function(){
		expect(Tokenizer).to.exist;
	});

	it('should copy values correctly', function(){
		const tokenizer = new Tokenizer();

		const tokens = tokenizer.tokenize(
			'foo + bar & something(like, this) | (hello & world) & $someVar 123 123.5'
		);

		expect(JSON.parse(JSON.stringify(tokens)))
		.to.deep.equal(
			[{
				'type': 'string',
				'value': 'foo'
			},{
				'type': 'operator',
				'value': '+'
			},{
				'type': 'string',
				'value': 'bar'
			},{
				'type': 'operator',
				'value': '&'
			},{
				'type': 'string',
				'value': 'something'
			},{
				'type': 'groupOpen',
				'value': '('
			},{
				'type': 'string',
				'value': 'like'
			},{
				'type': 'comma',
				'value': ','
			},{
				'type': 'string',
				'value': 'this'
			},{
				'type': 'groupClose',
				'value': ')'
			},{
				'type': 'operator',
				'value': '|'
			},{
				'type': 'groupOpen',
				'value': '('
			},{
				'type': 'string',
				'value': 'hello'
			},{
				'type': 'operator',
				'value': '&'
			},{
				'type': 'string',
				'value': 'world'
			},{
				'type': 'groupClose',
				'value': ')'
			},{
				'type': 'operator',
				'value': '&'
			},{
				'type': 'variable',
				'value': '$someVar'
			},{
				'type': 'string',
				'value': '123'
			},{
				'type': 'string',
				'value': '123.5'
			}]
		);
	});
});
