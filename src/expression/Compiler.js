
const {Block} = require('./Block.js'); 
const {Protoken} = require('./Protoken.js'); 

function getProtoken(master, pos, state, patterns){
	const char = master[pos];
	const keys = patterns.keys();

	state.last = pos !== 0 ? master[pos-1] : null;

	for (let i = 0, c = keys.length; i < c; i++){
		const key = keys[i];
		const rule = patterns.get(key);

		if (rule.begin(char, state)){
			return new Protoken(key, char, rule, master);
		}
	}

	return null;
}

function tokenize(str, patterns){
	const tokens = [];
	
	let misses = [];
	let state = {
		previous: null
	};

	for (let pos = 0, c = str.length; pos < c; pos++){
		const current = getProtoken(str, pos, state, patterns);

		if (current){
			state.pos = pos;
			current.setState(state);

			do {
				pos++;
			} while(pos < c && current.check(pos));

			if (current.token === undefined){
				current.lock(true);
			}

			tokens.push(current.token);

			pos--;
			state = {
				previous: current
			};
		} else {
			misses.push(str[pos]);
		}
	}

	return {
		tokens,
		misses
	};
}

function convertToken(token, expressions){
	// TODO : proper error management
	try {
		return expressions.get(token.type)(token);
	} catch(ex){
		console.log('::convertToken', token);
		console.log(ex);

		throw ex;
	}
}

// infix to postfix transformation
function compile(tokens, expressions){
	const infix = [].concat(...tokens.map(
		token => convertToken(token, expressions)
	));

	const processed = infix.reduce((state, exp) => {
		if (exp.type === 'operation'){
			while(state.ops.length && exp.rank >= state.ops[0].rank){
				state.postfix.push(state.ops.shift());
			}

			state.ops.unshift(exp);
		} else {
			state.postfix.push(exp);
		}

		return state;
	}, {postfix:[], ops:[]});

	const postfix = processed.ops.reduce((agg, op) => {
		agg.push(op);

		return agg;
	}, processed.postfix);

	return {
		infix,
		postfix
	};
}

class Compiler {
	constructor(parsingConfig, expressionConfig){
		this.parsingConfig = parsingConfig;
		this.expressionConfig = expressionConfig;
	}

	// take a string, convert it into a set of tokens in infix order
	tokenize(str){
		return tokenize(str, this.parsingConfig);
	}

	// take a token, convert it into an expression that can be evaluated
	getExpression(token){
		return convertToken(token, this.expressionConfig);
	}

	// take a set of tokens, assumed to be infix, and convert into infix / postfix order
	compile(tokens){
		return compile(tokens, this.expressionConfig);
	}

	// take a set of tokens, convert them into a postfix block
	buildBlock(tokens){
		return new Block(this.compile(tokens).postfix);
	}

	// take a set of tokens, covert them into a function that can be expressed
	buildExpressor(tokens){
		return this.buildBlock(tokens).prepare();
	}

	// take a string, convert it into a function that can be expressed
	prepare(str){
		return this.buildExpressor(this.tokenize(str).tokens);
	}
}

module.exports = {
	Compiler
};
