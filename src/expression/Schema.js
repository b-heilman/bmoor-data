
const {Block} = require('./Block.js');

const {config} = require('./Statement.js');

function makeBlock(schema){
	const block = new Block();

	if (schema.expressions){
		schema.expressions.forEach(expression =>
			block.addExpression(
				config.get('accessor')(expression),
				config.get('operation')(expression),
				config.get('constant')(expression),
				schema.joinType
			)
		);
	}

	if (schema.blocks){
		schema.blocks.forEach(child => 
			block.addBlock(
				makeBlock(child), 
				schema.joinType
			)
		);
	}

	return block;
}

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
class Schema {
	constructor(schema = {}){
		this.schema = schema;
	}

	toBlock(){
		return makeBlock(this.schema);
	}
}

module.exports = {
	Schema
};
