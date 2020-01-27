
const {Block} = require('./Block.js');

const {config} = require('./Statement.js');

function makeBlock(schema){
	const block = [];
	const joinType = config.get('join')({type: schema.joinType});

	if (schema.expressions){
		schema.expressions.reduce((agg, expression) => {
			agg.push(config.get('accessor')(expression)); // accessor
			agg.push(config.get('constant')(expression)); // value
			agg.push(config.get('operation')(expression)); // 

			if (agg.length > 3){
				agg.push(joinType);
			}

			return agg;
		}, block);
	}

	if (schema.blocks){
		schema.blocks.reduce((agg, block) => {
			agg.push(makeBlock(block));

			if (agg.length > 1){
				agg.push(joinType);
			}
		}, block);
	}

	return new Block(block);
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
