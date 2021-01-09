
const {Block} = require('./Block.js'); 
const {Protoken} = require('./Protoken.js'); 
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

function subReduce(tokens, pos, group){
	const toTest = group.map(
		def => ({
			source: def,
			tokens: def.tokens.slice(0)
		})
	);
	let found = null; // array of sources

	while(pos < tokens.length && toTest.length){
		const token = tokens[pos].type;

		toTest = toTest.filter(test => {
			const myToken = test.tokens.shift();

			if (myToken === token){
				if (test.tokens.length){
					return true;
				} else {
					found = test.source;
				}
			}
		});

		pos++;
	}

	return found;
}

/**
 * [] : {tokens:[], factory}
 **/
function tokenReduce(tokens, compounds){
	const index = compounds.keys().reduce(
		(agg, name) => {
			const compound = compounds.get(name);
			const first = compound.tokens[0];

			let group = agg[first];

			if (!group){
				group = [];

				agg[first] = group;
			}

			group.push({
				name,
				tokens: compound.tokens,
				factory: compound.factory
			});
		},
		{}
	);

	// I could write this to not be destructive?
	for(let i = 0, c = tokens.length; i < c; i++){
		let group = index[tokens[i].type];

		if (group){
			let match = subReduce(tokens, i, group);

			if (match){
				let sub = tokens.splice(i, match.tokens.length);

				tokens.splice(i, 0, match.factory(sub));

				c = tokens.length;
			}
		}

		i++;
	}

	return tokens;
}

// convert the tokens to expressions
function tokenExpress(token, expressions){
	const fn = expressions.get(token.type);

	if (!fn){
		throw new Error('unknown expression: '+token.type);
	}

	return fn(token);
}

// infix to postfix transformation
function compile(tokens, expressions){
	const infix = [].concat(...tokens.map(
		token => tokenExpress(token, expressions)
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
	constructor(parsingConfig, expressionConfig, compoundConfig=null){
		this.parsingConfig = parsingConfig;
		this.expressionConfig = expressionConfig;
		this.compoundConfig = compoundConfig;
	}

	// take a string, convert it into a set of tokens in infix order
	tokenize(str){
		const tokens = tokenize(str, this.parsingConfig);

		if (this.compoundConfig){

		}
	}

	// take a token, convert it into an expression that can be evaluated
	getExpression(token){
		return tokenExpress(token, this.expressionConfig);
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
