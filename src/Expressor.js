
const bmoor = require('bmoor');
const {Tokenizer} = require('./Tokenizer.js');

class Expressor {
	constructor(ops = {}){
		this.tokenizer = new Tokenizer(ops);
	}

	compile(str){
		const tokens = this.tokenizer.tokenize(str);

		this.expression = this.build(tokens);
	}

	build(tokens){
		// construct all getter functions
		let expression = tokens.reduce((ops, token, dex) => {
			if (token.type === 'variable'){
				ops.push(bmoor.makeGetter(token.value.substring(1)));
			} else if (token.type === 'string'){
				const next = tokens[dex+1];

				if (!next || next.type !== 'groupOpen'){
					let value = token.value;

					if (!/[^0-9\.]/.test(value)){
						value = token.value.indexOf('.') === -1 ? 
							parseInt(token.value) : parseFloat(token.value);
					}

					ops.push(function(){
						return value;
					});
				} else {
					ops.push(token);
				}
			} else {
				ops.push(token);
			}

			return ops;
		}, []);

		const results = expression.reduce((agg, token) => {
			if (token.type === 'groupClose'){
				if (agg.count === 1){
					agg.ops.push(this.build(agg.group));
					agg.group = null;
				} else {
					agg.count--;
					agg.group.push(token);
				}
			} else if (token.type === 'groupOpen'){
				if (agg.group){
					agg.group.push(token);
					agg.count++;
				} else {
					agg.group = [];
					agg.count = 1;
				}
			} else {
				if (agg.group){
					agg.group.push(token);
				} else {
					agg.ops.push(token);
				}
			}

			return agg;
		}, {
			ops: [],
			group: null
		});

		if (results.groups){
			throw new Error('unclose group');
		}

		const operations = results.ops;

		// do all boolean comparisons
		let hop = 0;
		const comps = operations.reduce((agg, token, pos) => {
			if (hop){
				hop--;
			} else if (token.type === 'compare'){
				const leftFn = agg.pop();
				const rightFn = operations[pos+1];

				hop = 1;

				if (token.value === '='){
					agg.push(function(obj){
						const l = leftFn(obj);
						const r = rightFn(obj);

						return l === r;
					});
				} else {
					agg.push(function(obj){
						const l = leftFn(obj);
						const r = rightFn(obj);

						return l.indexOf(r) !== -1;
					});
				}
			} else {
				agg.push(token);
			}

			return agg;
		}, []);

		// run the operations
		hop = 0;
		const ops = comps.reduce((agg, token, pos) => {
			if (hop){
				hop--;
			} else if (token.type === 'operator'){
				const leftFn = agg.pop();
				const rightFn = comps[pos+1];

				hop = 1;

				if (token.value === '&'){
					agg.push(function(obj){// jshint ignore:line
						return leftFn(obj) && rightFn(obj);
					});
				} else if (token.value === '|'){
					agg.push(function(obj){
						return leftFn(obj) || rightFn(obj);
					});
				} else {
					throw new Error('unknown operator: '+token.value);
				}
			} else {
				agg.push(token);
			}

			return agg;
		}, []);

		if (ops.length !== 1){
			throw new Error('failure to build: operators =>'+ops.length);
		} else {
			return ops[0];
		}
	}
	
	express(obj){
		return this.expression(obj);
	}
}

module.exports = {
	Expressor
};
