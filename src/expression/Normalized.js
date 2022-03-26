const {Block} = require('./Block.js');
const {Token} = require('./Token.js');

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
function makeBlock(compiler, schema) {
	const block = new Block();

	if (schema.expressions) {
		schema.expressions.forEach((expression) =>
			block.addExpression(
				compiler.getExpression(new Token('accessor', expression.path))[0],
				compiler.getExpression(new Token('operation', expression.operator))[0],
				compiler.getExpression(
					new Token('constant', expression.value, {subtype: expression.type})
				)[0],
				compiler.getExpression(new Token('operation', schema.joinType))[0]
			)
		);
	}

	if (schema.blocks) {
		schema.blocks.forEach((child) =>
			block.addBlock(
				makeBlock(compiler, child),
				compiler.getExpression(new Token('operation', schema.joinType))[0]
			)
		);
	}

	return block;
}

class Normalized {
	constructor(compiler, schema = {}) {
		this.schema = schema;
		this.compiler = compiler;
	}

	buildBlock() {
		if (!this.block) {
			this.block = makeBlock(this.compiler, this.schema);
		}

		return this.block;
	}

	joinSchema(schema, joinType) {
		this.block.addBlock(
			new Normalized(this.compiler, schema).buildBlock(),
			this.compiler.getExpression(new Token('operation', joinType))[0]
		);
	}
}

module.exports = {
	Normalized
};
