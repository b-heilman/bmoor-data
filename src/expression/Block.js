
const {config} = require('./Statement.js');

class Block{
	constructor(block = []){
		this.type = 'access';
		this.block = block;
	}

	eval(obj){
		const express = this.block.reduce((stack, exp) => {
			if (exp.type === 'access'){
				// doing it like this allows it to be 'lazy', if an and statement, 
				// the right won't be run if the left is false for example
				stack.push(exp.prepare());
			} else {
				const left = stack.pop();
				const right = stack.pop();

				stack.push(function evalBlock(){
					return exp.eval(left, right, obj);
				});
			}

			return stack;
		}, [])[0];

		return express(obj);
	}

	prepare(){
		return this.block.reduce((stack, exp) => {
			if (exp.type === 'access'){
				stack.push(exp.prepare());
			} else {
				const right = stack.pop();
				const left = stack.pop();

				stack.push(function preparedBlock(obj){
					return exp.eval(left, right, obj);
				});
			}

			return stack;
		}, [])[0];
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
	fromSchema(schema, join = null){
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
				const child = new Block();

				child.fromSchema(block);

				agg.push(child);

				if (agg.length > 1){
					agg.push(joinType);
				}
			}, block);
		}

		if (join){
			block.push(
				config.get('join')({type: join})
			);

			this.block = this.block.concat(block);
		} else {
			this.block = block;
		}
	}

	toJSON(){
		return this.block.map(m => m.toJSON());
	}

	toString(){
		return this.toJSON();
	}
}

module.exports = {
	Block
};
