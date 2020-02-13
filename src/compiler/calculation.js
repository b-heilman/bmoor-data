
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
		begin: function(ch, state){
			return state.last !== escapeChar && ch === '$';
		},

		end : function(ch, state){
			if (isPath.test(ch)){
				return false;
			}

			if (ch==='['){
				state.bracketOpen = true;

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

			return true;
		},
		toToken: function(buffer, forced){
			const content = forced ? 
				buffer.substring(1) : buffer.substring(1, buffer.length - 1);

			return new Token('accessor', content);
		}
	},

	string: {
		begin: function(ch, state){
			if (state.last !== escapeChar && isQuote.test(ch)){
				state.quote = ch;

				return true;
			} else {
				return false;
			}
		},
		end: function(ch, state){
			if (state.close){
				return true;
			}else if (ch === state.quote && state.last !== escapeChar){
				state.close = true;
			}

			return false;
		},
		toToken: function(buffer, forced, state){
			const escape = escapeChar === '\\' ? '\\\\'+state.quote : escapeChar+state.quote;
			
			buffer = buffer.replace(new RegExp(escape,'g'), state.quote);
			
			const content = forced ? 
				buffer.substring(1, buffer.length-1) : buffer.substring(1, buffer.length-2);

			return new Token('constant', content, {subtype: 'string'});
		}
	},

	number: {
		begin: function(ch){
			return isDigit.test(ch);
		},
		end: function(ch, state){
			if (isDigit.test(ch)){
				return false;
			}

			if (ch === '.'){
				state.isFloat = true;
				return false;
			}

			return true;
		},
		toToken: function(buffer, forced, state){
			const content = state.isFloat ?
				parseFloat(buffer) : parseInt(buffer);

			return new Token('constant', content, {subtype: 'number'});
		}
	},

	operation: {
		begin: function(ch){
			return isOperator.test(ch);
		},
		end: function(ch){
			return !isOperator.test(ch);
		},
		toToken: function(buffer, forced){
			const content = forced ? buffer : buffer.substring(0, buffer.length-1);

			return new Token('operation', content);
		}
	},

	method: {
		begin: function(ch){
			return isCharacter.test(ch);
		},
		end: function(ch, state){
			if (state.close){
				return true;
			}

			if (isCharacter.test(ch)){
				return false;
			}

			if (!state.open && ch === '('){
				state.open = true;
				state.count = 1;

				return false;
			} else if (state.open){
				if (ch === '('){
					state.count = state.count + 1;
				} else if (ch === ')'){
					state.count = state.count - 1;

					if (state.count === 0){
						state.close = true;
					}
				}

				return false;
			}

			return true;
		},
		toToken: function(buffer, forced){
			const content = forced ?
					buffer.substring(0, buffer.length) : buffer.substring(0, buffer.length-1);
			
			return new Token('method', content);
		}
	},

	block: {
		begin: function(ch, state){
			if (ch === '('){
				state.count = 1;
				state.open = ch;
				state.close = ')';

				return true;
			} else {
				return false;
			}
		},
		end: function(ch, state){
			if (ch === state.open){
				state.count = state.count + 1;
			} else if (ch === state.close){
				state.count = state.count - 1;

				if (state.count === 0){
					return true;
				}
			}

			return false;
		},
		toToken: function(buffer){
			return new Token('block', buffer.substring(1, buffer.length-1));
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
	/*
	method: function(token){

	},
	*/
});

const compiler = new Compiler(parsings, expressions);

expressions.set('block', function(token){
	return [compiler.buildBlock(compiler.tokenize(token.value).tokens)];
});

module.exports = {
	config,
	compiler
};
