
const {Block} = require('./Block.js'); 
const {Protoken} = require('./Protoken.js'); 

function nextProtoken(master, pos, state, patterns){
	const keys = patterns.keys();

	state.last = pos !== 0 ? master[pos-1] : null;

	for (let i = 0, c = keys.length; i < c; i++){
		const key = keys[i];
		const rule = patterns.get(key);

		const open = rule.open(master, pos, state);

		if (open){
			return new Protoken(key, rule, master, open, state);
		}
	}

	return null;
}

function tokenize(str, patterns){
	let tokens = [];
	let misses = [];

	const sets = [{
		tokens,
		misses
	}];
	
	let state = null;

	let previous = null;
	for (let pos = 0, c = str.length; pos < c; pos++){
		state = {
			previous
		};

		const current = nextProtoken(str, pos, state, patterns);

		if (current){
			previous = current;
			pos = current.close-1;

			tokens.push(current.token);
		} else {
			const ch = str[pos];

			if (ch === ','){
				tokens = [];
				misses = [];

				sets.push({
					tokens,
					misses
				});
			} else {
				misses.push();
			}
		}
	}

	return sets;
}

function convertToken(token, expressions){
	const fn = expressions.get(token.type);

	if (!fn){
		throw new Error('unknown expression: '+token.type);
	}

	return fn(token);
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
		const sets = this.tokenize(str);
		const fns = sets.map(set => this.buildExpressor(set.tokens));

		return (ctx) => fns.map(fn => fn(ctx));
	}
}

module.exports = {
	Compiler
};
