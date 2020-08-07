
const {Config} = require('bmoor/src/lib/config.js');
const {makeGetter} = require('bmoor/src/core.js');

const {Token} = require('../expression/Token.js'); 
const {Expressable} = require('../expression/Expressable.js');
const {Compiler} = require('../expression/Compiler.js');

const isPath = /[\w\.]/;
const isDigit = /\d/;
const isCharacter = /[\w]/;
const isQuote = /"|'|`/;
const isOperator = /\+|-|\*|\/|\^|\||\&|=|~|<|>|\!/;

const escapeChar = '\\';

const config = new Config({});

const parsings = config.sub('parsings', {
	accessor: {
		open: function(master, pos, state){
			const ch = master[pos];

			if (state.last !== escapeChar && ch === '$'){
				return {
					pos: pos+2,
					begin: pos+1
				};
			}
		},
		close: function(master, pos){
			const ch = master[pos];

			if (isPath.test(ch)){
				return null;
			}

			/* ignoring bracket notation for now
			if (ch==='[' && isQuote.test(master[pos+1])){
				state.bracketOpen = true;
				state.inQuote = 

				return false;
			} else if (state.bracketOpen && isQuote.test(ch)){
				state.bracketOpen = false;
				state.inQuote = ch;

				return false;
			} else if (
				state.inQuote && ch === state.inQuote && 
				state.last !== escapeChar
			){
				state.inQuote = false;
				state.doneQuote = true;

				return false;
			} else if (
				ch===']' && 
				(state.doneQuote || state.bracketOpen)
			){
				return false;
			}
			*/

			return {
				pos: pos,
				end: pos - 1
			};
		},
		toToken: function(content){
			return new Token('accessor', content);
		}
	},

	string: {
		open: function(master, pos, state){
			const ch = master[pos];

			if (state.last !== escapeChar && isQuote.test(ch)){
				state.quote = ch;

				return {
					pos: pos+2,
					begin: pos+1
				};
			}
		},
		close: function(master, pos, state){
			const ch = master[pos];

			if (ch === state.quote && state.last !== escapeChar){
				return {
					pos: pos+1,
					end: pos-1
				};
			}

			return null;
		},
		toToken: function(content, state){
			const escape = escapeChar === '\\' ? '\\\\'+state.quote : escapeChar+state.quote;
			
			content = content.replace(new RegExp(escape,'g'), state.quote);

			return new Token('constant', content, {subtype: 'string'});
		}
	},

	number: {
		open: function(master, pos){
			const ch = master[pos];

			if (isDigit.test(ch)){
				return {
					pos: pos+1,
					begin: pos
				};
			}
		},
		close: function(master, pos, state){
			const ch = master[pos];
			
			if (isDigit.test(ch)){
				return null;
			}

			if (ch === '.'){
				state.isFloat = true;
				return null;
			}

			return {
				pos: pos,
				end: pos-1
			};
		},
		toToken: function(content, state){
			content = state.isFloat ? parseFloat(content) : parseInt(content);

			return new Token('constant', content, {subtype: 'number'});
		}
	},

	operation: {
		// +
		open: function(master, pos){
			const ch = master[pos];
			
			if (isOperator.test(ch)){
				return {
					pos: pos+1,
					begin: pos
				};
			}
		},
		close: function(master, pos){
			const ch = master[pos];
			
			if (!isOperator.test(ch)){
				return {
					pos: pos,
					end: pos-1
				};
			}
		},
		toToken: function(content){
			return new Token('operation', content);
		}
	},

	method: {
		// method(some, vars)
		open: function(master, pos, state){
			const ch = master[pos];
			
			if (isCharacter.test(ch)){
				state.begin = pos;

				return {
					pos: pos+1,
					begin: pos
				};
			}

			return false;
		},
		close: function(master, pos, state){
			const ch = master[pos];
			
			if (isCharacter.test(ch)){
				return false;
			}

			if (!state.open && ch === '('){
				state.open = true;
				state.openPos = pos;
				state.count = 1;

				return false;
			} else if (state.open){
				if (ch === '('){
					state.count = state.count + 1;
				} else if (ch === ')'){
					state.count = state.count - 1;

					if (state.count === 0){
						state.closePos = pos;

						return {
							pos: pos+1,
							end: pos
						};
					}
				}

				return false;
			}

			return {
				pos: pos+1,
				end: pos-1
			};
		},
		toToken: function(content, state){
			const metadata = {};

			if (state.openPos){
				metadata.name = content.substring(
					0,
					state.openPos - state.begin
				);

				metadata.arguments = content.substring(
					state.openPos - state.begin + 1,
					state.closePos - state.begin
				);
			} else {
				metadata.name = content;
			}

			return new Token('method', content, metadata);
		}
	},

	// (foo, bar)
	block: {
		open: function(master, pos, state){
			const ch = master[pos];
			
			if (ch === '('){
				state.count = 1;
				state.open = ch;
				state.close = ')';

				return {
					pos: pos+1,
					begin: pos+1
				};
			}
		},
		close: function(master, pos, state){
			const ch = master[pos];
			
			if (ch === state.open){
				state.count = state.count + 1;
			} else if (ch === state.close){
				state.count = state.count - 1;

				if (state.count === 0){
					return {
						pos: pos+1,
						end: pos-1
					};
				}
			}
		},
		toToken: function(content){
			return new Token('block', content);
		}
	}
});

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
		fn: function lt(left, right, obj){
			return left(obj) < left(obj);
		},
		rank: 6
	},
	'<=': {
		fn: function lte(left, right, obj){
			return left(obj) <= left(obj);
		},
		rank: 6
	},
	'>': {
		fn: function gt(left, right, obj){
			return left(obj) > left(obj);
		},
		rank: 6
	},
	'>=': {
		fn: function gte(left, right, obj){
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

let compiler = null;

const methods = config.sub('methods', {
	join: function(glue, ...args){
		return args.join(glue);
	},
	sum: function(...args){
		return args.reduce((agg,v) => agg+v);
	}
});

const expressions = config.sub('expressions', {
	accessor: function(token){
		const getter = makeGetter(token.value);

		getter.name = 'getter:'+token.value;

		return [new Expressable('value', getter)];
	},

	constant: function(token){
		const loading = token.metadata.subtype.toLowerCase();
		const fn = constants.get(loading);

		if (!fn){
			throw new Error('Unable to load constant: '+loading);
		}

		return [new Expressable('value', fn(token.value))];
	},

	operation: function(token){
		const loading = token.value.toLowerCase();

		try{
			const {fn, rank} = operations.get(loading);

			return [new Expressable('operation', fn, rank)];
		} catch(ex){
			throw new Error('Unable to load operation: '+loading);
		}
	},

	method: function(token){
		let fn = null;

		if (token.value === 'null'){
			fn = () => null;
		} else if (token.value === 'undefined'){
			fn = () => undefined;
		} else {
			const tFn = methods.get(token.metadata.name);

			if (token.metadata.arguments){
				const prepared = compiler.prepare(token.metadata.arguments);
				fn = (ctx) => tFn(...prepared(ctx));
			} else {
				fn = tFn;
			}
		}

		return [new Expressable('value', fn)];
	}
});

compiler = new Compiler(parsings, expressions);

expressions.set('block', function(token){
	return [compiler.buildBlock(compiler.tokenize(token.value).tokens)];
});

module.exports = {
	config,
	compiler,
	expressions
};
