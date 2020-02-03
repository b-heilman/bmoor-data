
const {Block} = require('./Block.js');
const {Token} = require('./Token.js');

const {convertToken} = require('./Compiler.js');

/** Expression Schema 
 * #expression { // relational and access (path [operator] (value||test))
 *   info: {} // generic json to be used by expressor
 *   type: ''
 *   path: ''
 *   operator: ''
 *   value: ''
 * }
 * 
 * #block {
 *   expressions: [
 *     #expression
 *   ],
 *   blocks: [
 *     #block
 *   ],
 *   joinType: ''
 * }
 **/
function makeBlock(schema){
	const block = new Block();

	if (schema.expressions){
		schema.expressions.forEach(expression =>
			block.addExpression(
				convertToken(new Token('accessor', expression.path)),
				convertToken(new Token('operation', expression.operator)),
				convertToken(new Token('constant', expression.value, {subtype: expression.type})),
				convertToken(new Token('operation', schema.joinType))
			)
		);
	}

	if (schema.blocks){
		schema.blocks.forEach(child => 
			block.addBlock(
				makeBlock(child), 
				convertToken(new Token('operation', schema.joinType))
			)
		);
	}

	return block;
}

class Normalized {
	constructor(schema = {}){
		this.schema = schema;
	}

	buildBlock(){
		if (!this.block){
			this.block = makeBlock(this.schema);
		}

		return this.block;
	}

	joinSchema(schema, joinType){
		this.block.addBlock(
			(new Normalized(schema)).buildBlock(),
			convertToken(new Token('operation', joinType))
		);
	}
}

module.exports = {
	Normalized
};
