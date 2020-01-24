
const {Config} = require('bmoor/src/lib/config.js');
const {makeGetter} = require('bmoor/src/core.js');

class Expression{
	constructor(type, method){
		this.type = type;
		this.method = method;
	}

	eval(...args){
		return this.method(...args);
	}

	toJSON(){
		return {type: this.type, method: this.method.name};
	}

	toString(){
		return `{"type":"${this.type}", "method":"${this.method.toString()}"}`;
	}
}

class ExpressionBlock{
	constructor(block){
		this.type = 'access';
		this.block = block;
	}

	eval(obj){
		const express = this.block.reduce((stack, exp) => {
			if (exp.type === 'access'){
				// doing it like this allows it to be 'lazy', if an and statement, 
				// the right won't be run if the left is false for example
				stack.push(exp.eval.bind(exp));
			} else {
				const left = stack.pop();
				const right = stack.pop();

				stack.push(function(){
					return exp.eval(left, right, obj)
				});
			}

			return stack;
		}, [])[0];

		return express();
	}

	prepare(){
		return this.block.reduce((stack, exp) => {
			if (exp.type === 'access'){
				stack.push(exp.eval.bind(exp));
			} else {
				const right = stack.pop();
				const left = stack.pop();

				stack.push(function(obj){
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
		const joinType = config.get('expressions.boolean')({operator: schema.joinType.toLowerCase()});

		if (schema.expressions){
			schema.expressions.reduce((agg, expression) => {
				agg.push(config.get('expressions.accessor')(expression)); // accessor
				agg.push(config.get('expressions.constant')(expression)); // value
				agg.push(config.get('expressions.operation')(expression)); // 

				if (agg.length > 3){
					agg.push(joinType);
				}

				return agg;
			}, block);
		}

		if (schema.blocks){
			schema.blocks.reduce((agg, block) => {
				agg.push(inflate(block));

				if (agg.length > 3){
					agg.push(joinType);
				}
			}, block);
		}

		if (join){
			block.push(
				config.get('expressions.boolean')({operator: join.toLowerCase()})
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

const config = new Config({
	constant: {
		string: function(token){
			const value = token.value;

			return function stringValue(){
				return value; // it will already be a string
			};
		},
		number: function(token){
			const value = parseInt(token.value);

			return function numberValue(){
				return value;
			};
		},
		boolean: function(token){
			const value = (token.value === 'true' || parseInt(token.value) === 1);

			return function booleanValue(){
				return value;
			};
		}
	},
	methods: {

	},
	operations: {
		string: {
			contains: function(left, right, obj){
				return left(obj).indexOf(right(obj)) !== -1;
			},
			equals: function(left, right, obj){
				return left(obj) ===  right(obj);
			}
		},
		number: {
			'+': function(left, right, obj){
				return left(obj) + right(obj);
			},
			'-': function(left, right, obj){
				return left(obj) - left(obj);
			},
			'*': function(left, right, obj){
				return left(obj) - right(obj);
			},
			'/': function(left, right, obj){
				return left(obj) / right(obj); 
			},
			'==': function(left, right, obj){
				return left(obj) === right(obj);
			}
		},
		boolean: {
			'&&': function(left, right, obj){
				return left(obj) && right(obj);
			},
			'and': function(left, right, obj){
				return left(obj) && right(obj);
			},
			'||': function(left, right, obj){
				return left(obj) || right(obj);
			},
			'or': function(left, right, obj){
				return left(obj) || right(obj);
			}
		}
	},
	/**
	 * factory(tokens)
	 **/
	expressions: {
		constant: function(token){
			const loading = `constant.${token.type}`;
			const fn = config.get(loading);

			if (!fn){
				throw new Error('Unable to load constant: '+loading);
			}

			return new Expression('access', fn(token));
		},
		accessor: function(token){
			const getter = makeGetter(token.path);

			return new Expression('access', getter);
		},
		method: function(token){
			// TODO : yeah
			console.log('what do I do with this', token);
		},
		operation: function(token){
			const loading = `operations.${token.type}.${token.operator}`;
			const fn = config.get(loading);

			if (!fn){
				throw new Error('Unable to load constant: '+loading);
			}

			return new Expression('pair', fn);
		},
		boolean: function(token){
			const loading = `operations.boolean.${token.operator}`;
			const fn = config.get(loading);

			if (!fn){
				throw new Error('Unable to load constant: '+loading);
			}

			return new Expression('pair', fn);
		}
	}
});

module.exports = {
	config,
	Expression,
	ExpressionBlock
};
