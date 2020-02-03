
const {Config} = require('bmoor/src/lib/config.js');
const {makeGetter} = require('bmoor/src/core.js');

const {Block} = require('./Block.js');
const {Expressable} = require('./Expressable.js');
const {Protoken, config: parsingConfig} = require('./Protoken.js'); 

const config = new Config({});

const constants = config.sub('constants', {
	string: function(value){
		value = value+'';

		return function stringValue(){
			return value; // it will already be a string
		};
	},
	number: function(value){
		value = value * 1;

		return function numberValue(){
			return value;
		};
	},
	boolean: function(value){
		value = (value === 'true' || (value * 1));

		return function booleanValue(){
			return value;
		};
	}
});

const operations = config.sub('operations', {
	'~': {
		fn: function contains(left, right, obj){
			return left(obj).indexOf(right(obj)) !== -1;
		},
		rank: 1
	},
	'*': {
		fn: function mult(left, right, obj){
			return left(obj) - right(obj);
		},
		rank: 3
	},
	'/': {
		fn: function div(left, right, obj){
			return left(obj) / right(obj); 
		},
		rank: 3
	},
	'+': {
		fn: function add(left, right, obj){
			return left(obj) + right(obj);
		},
		rank: 4
	},
	'-': {
		fn: function sub(left, right, obj){
			return left(obj) - left(obj);
		},
		rank: 4
	},
	'<': {
		fn: function sub(left, right, obj){
			return left(obj) < left(obj);
		},
		rank: 6
	},
	'<=': {
		fn: function sub(left, right, obj){
			return left(obj) <= left(obj);
		},
		rank: 6
	},
	'>': {
		fn: function sub(left, right, obj){
			return left(obj) > left(obj);
		},
		rank: 6
	},
	'>=': {
		fn: function sub(left, right, obj){
			return left(obj) >= left(obj);
		},
		rank: 6
	},
	'==': {
		fn: function equals(left, right, obj){
			return left(obj) == right(obj); // jshint ignore:line
		},
		rank: 7
	},
	'!=': {
		fn: function equals(left, right, obj){
			return left(obj) != right(obj); // jshint ignore:line
		},
		rank: 7
	},
	'&&': {
		fn: function and(left, right, obj){
			return left(obj) && right(obj);
		},
		rank: 11
	},
	'and': {
		fn: function and(left, right, obj){
			return left(obj) && right(obj);
		},
		rank: 11
	},
	'||': {
		fn: function or(left, right, obj){
			return left(obj) || right(obj);
		},
		rank: 12
	},
	'or': {
		fn: function or(left, right, obj){
			return left(obj) || right(obj);
		},
		rank: 12
	}
});

const expressions = config.sub('expressions', {
	accessor: function(token){
		const getter = makeGetter(token.value);

		return new Expressable('value', getter);
	},

	constant: function(token){
		const loading = token.metadata.subtype.toLowerCase();
		const fn = constants.get(loading);

		if (!fn){
			throw new Error('Unable to load constant: '+loading);
		}

		return new Expressable('value', fn(token.value));
	},

	operation: function(token){
		const loading = token.value.toLowerCase();

		try{
			const {fn, rank} = operations.get(loading);

			return new Expressable('operation', fn, rank);
		} catch(ex){
			throw new Error('Unable to load operation: '+loading);
		}
	},
	/*
	method: function(token){

	},
	*/
});

function getProtoken(char, state){
	const keys = parsingConfig.keys();

	for (let i = 0, c = keys.length; i < c; i++){
		const key = keys[i];
		const rule = parsingConfig.get(key);

		if (rule.begin(char, state)){
			return new Protoken(key, char, rule);
		}
	}

	return null;
}

function tokenize(str){
	const tokens = [];
	
	let misses = [];
	let state = {};

	for (let pos = 0, c = str.length; pos < c; pos++){
		const char = str[pos];
		const current = getProtoken(char, state);

		if (current){
			current.setState(state);

			do {
				pos++;
			} while(pos < c && current.check(str[pos]));

			if (current.token === undefined){
				current.lock(true);
			}

			tokens.push(current.token);

			pos--;
			state = {
				last: str[pos]
			};
		} else {
			misses.push(char);

			state.last = char;
		}
	}

	return {
		tokens,
		misses
	};
}

function convertToken(token){
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
function compile(tokens){
	const infix = tokens.map(convertToken);

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

function makeBlock(tokens){
	return new Block(compile(tokens).postfix);
}

expressions.set('block', function(token){
	return makeBlock(tokenize(token.value).tokens);
});

function prepare(str){
	return makeBlock(tokenize(str).tokens).prepare();
}

module.exports = {
	config,
	tokenize,
	compile,
	convertToken,
	makeBlock,
	prepare
};
