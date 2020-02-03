
class Block{
	constructor(tokens = []){
		this.type = 'value';

		// parse the token
		this.block = tokens;
	}

	addStatement(statement){
		this.block.push(statement);
	}

	addJoin(join){
		this.block.push(join);
	}

	// TODO : make this addStatement, and expression is the one line
	addExpression(left, operator, right, join){
		this.addStatement(left);
		this.addStatement(right);
		this.addStatement(operator);

		if (join && this.block.length > 3){
			this.addJoin(join);
		}
	}

	addBlock(block, join){
		this.block.push(block);

		if (this.block.length > 1){
			this.addJoin(join);
		}
	}

	eval(obj){
		const express = this.block.reduce((stack, exp) => {
			if (exp.type === 'value'){
				// doing it like this allows it to be 'lazy', if an and statement, 
				// the right won't be run if the left is false for example
				stack.push(exp.prepare());
			} else {
				const left = stack.pop();
				const right = stack.pop();

				stack.push(function evalBlock(){
					const rtn = exp.eval(left, right, obj);

					return rtn;
				});
			}

			return stack;
		}, [])[0];

		return express(obj);
	}

	prepare(){
		return this.block.reduce((stack, exp) => {
			if (exp.type === 'value'){
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
