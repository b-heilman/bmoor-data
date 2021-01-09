
const {expect} = require('chai');
const {Config} = require('bmoor/src/lib/config.js');

describe('bmoor-data.expression.compiler', function(){
	const {compiler} = require('./Compiler.js');
	
	describe('::tokenize', function(){
		it('should work for blocks', function(){
			expect(JSON.parse(JSON.stringify(
				compiler.tokenize('(like, this)')[0].tokens
			))).to.deep.equal([{
				'type': 'block',
				'metadata': null,
				'value': 'like, this'
			}]);
		});
	});
});
