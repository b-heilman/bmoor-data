const {Config, ConfigObject} = require('bmoor/src/lib/config.js');
const {makeGetter} = require('bmoor/src/core.js');

const {Token} = require('../expression/Token.js');
const {Expressable} = require('../expression/Expressable.js');
const {Compiler} = require('../expression/Compiler.js');

const isPath = /[\w.]/;
const isDigit = /\d/;
const isCharacter = /[\w]/;
const isQuote = /"|'|`/;
const isOperator = /\+|-|\*|\/|\^|\||&|=|~|<|>|!/;

const escapeChar = '\\';

const parsings = new Config({
	accessor: new ConfigObject({
		open: function (master, pos, state) {
			const ch = master[pos];

			if (state.last !== escapeChar && ch === '$') {
				if (master[pos + 1] === '{') {
					state.complex = true;

					return {
						pos: pos + 2,
						begin: pos + 2
					};
				} else {
					return {
						pos: pos + 2,
						begin: pos + 1
					};
				}
			}
		},
		close: function (master, pos, state) {
			const ch = master[pos];

			if (state.complex) {
				if (state.last !== escapeChar && master[pos] === '}') {
					return {
						pos: pos + 1,
						end: pos - 1
					};
				}
			} else {
				if (!isPath.test(ch)) {
					return {
						pos: pos,
						end: pos - 1
					};
				}
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
		},
		toToken: function (content) {
			return new Token('accessor', content);
		}
	}),

	string: new ConfigObject({
		open: function (master, pos, state) {
			const ch = master[pos];

			if (state.last !== escapeChar && isQuote.test(ch)) {
				state.quote = ch;

				return {
					pos: pos + 2,
					begin: pos + 1
				};
			}
		},
		close: function (master, pos, state) {
			const ch = master[pos];

			if (ch === state.quote && state.last !== escapeChar) {
				return {
					pos: pos + 1,
					end: pos - 1
				};
			}

			return null;
		},
		toToken: function (content, state) {
			const escape =
				escapeChar === '\\' ? '\\\\' + state.quote : escapeChar + state.quote;

			content = content.replace(new RegExp(escape, 'g'), state.quote);

			return new Token('constant', content, {subtype: 'string'});
		}
	}),

	number: new ConfigObject({
		open: function (master, pos) {
			const ch = master[pos];

			if (isDigit.test(ch)) {
				return {
					pos: pos + 1,
					begin: pos
				};
			}
		},
		close: function (master, pos, state) {
			const ch = master[pos];

			if (isDigit.test(ch)) {
				return null;
			}

			if (ch === '.') {
				state.isFloat = true;
				return null;
			}

			return {
				pos: pos,
				end: pos - 1
			};
		},
		toToken: function (content, state) {
			content = state.isFloat ? parseFloat(content) : parseInt(content);

			return new Token('constant', content, {subtype: 'number'});
		}
	}),

	operation: new ConfigObject({
		// +
		open: function (master, pos) {
			const ch = master[pos];

			if (isOperator.test(ch)) {
				return {
					pos: pos + 1,
					begin: pos
				};
			}
		},
		close: function (master, pos) {
			const ch = master[pos];

			if (!isOperator.test(ch)) {
				return {
					pos: pos,
					end: pos - 1
				};
			}
		},
		toToken: function (content) {
			return new Token('operation', content);
		}
	}),

	method: new ConfigObject({
		// method(some, vars)
		open: function (master, pos, state) {
			const ch = master[pos];

			if (isCharacter.test(ch)) {
				state.begin = pos;

				return {
					pos: pos + 1,
					begin: pos
				};
			}

			return false;
		},
		close: function (master, pos, state) {
			const ch = master[pos];

			if (isCharacter.test(ch)) {
				return false;
			}

			if (!state.open && ch === '(') {
				state.open = true;
				state.openPos = pos;
				state.count = 1;

				return false;
			} else if (state.open) {
				if (ch === '(') {
					state.count = state.count + 1;
				} else if (ch === ')') {
					state.count = state.count - 1;

					if (state.count === 0) {
						state.closePos = pos;

						return {
							pos: pos + 1,
							end: pos
						};
					}
				}

				return false;
			}

			return {
				pos: pos + 1,
				end: pos - 1
			};
		},
		toToken: function (content, state) {
			const metadata = {};

			if (state.openPos) {
				metadata.name = content.substring(0, state.openPos - state.begin);

				metadata.arguments = content.substring(
					state.openPos - state.begin + 1,
					state.closePos - state.begin
				);
			} else {
				metadata.name = content;
			}

			return new Token('method', content, metadata);
		}
	}),

	// (foo, bar)
	block: new ConfigObject({
		open: function (master, pos, state) {
			const ch = master[pos];

			if (ch === '(') {
				state.count = 1;
				state.open = ch;
				state.close = ')';

				return {
					pos: pos + 1,
					begin: pos + 1
				};
			}
		},
		close: function (master, pos, state) {
			const ch = master[pos];

			if (ch === state.open) {
				state.count = state.count + 1;
			} else if (ch === state.close) {
				state.count = state.count - 1;

				if (state.count === 0) {
					return {
						pos: pos + 1,
						end: pos - 1
					};
				}
			}
		},
		toToken: function (content) {
			return new Token('block', content);
		}
	})
});

const constants = new Config({
	string: function (value) {
		value = value + '';

		return function stringValue() {
			return value; // it will already be a string
		};
	},
	number: function (value) {
		value = value * 1;

		return function numberValue() {
			return value;
		};
	},
	boolean: function (value) {
		value = value === 'true' || value * 1;

		return function booleanValue() {
			return value;
		};
	}
});

const operations = new Config({
	'~': new ConfigObject({
		fn: function contains(left, right, obj) {
			return left(obj).indexOf(right(obj)) !== -1;
		},
		rank: 1
	}),
	'*': new ConfigObject({
		fn: function mult(left, right, obj) {
			return left(obj) - right(obj);
		},
		rank: 3
	}),
	'/': new ConfigObject({
		fn: function div(left, right, obj) {
			return left(obj) / right(obj);
		},
		rank: 3
	}),
	'+': new ConfigObject({
		fn: function add(left, right, obj) {
			return left(obj) + right(obj);
		},
		rank: 4
	}),
	'-': new ConfigObject({
		fn: function sub(left, right, obj) {
			return left(obj) - left(obj);
		},
		rank: 4
	}),
	'<': new ConfigObject({
		fn: function lt(left, right, obj) {
			return left(obj) < left(obj);
		},
		rank: 6
	}),
	'<=': new ConfigObject({
		fn: function lte(left, right, obj) {
			return left(obj) <= left(obj);
		},
		rank: 6
	}),
	'>': new ConfigObject({
		fn: function gt(left, right, obj) {
			return left(obj) > left(obj);
		},
		rank: 6
	}),
	'>=': new ConfigObject({
		fn: function gte(left, right, obj) {
			return left(obj) >= left(obj);
		},
		rank: 6
	}),
	'==': new ConfigObject({
		fn: function equals(left, right, obj) {
			return left(obj) == right(obj); // jshint ignore:line
		},
		rank: 7
	}),
	'!=': new ConfigObject({
		fn: function equals(left, right, obj) {
			return left(obj) != right(obj); // jshint ignore:line
		},
		rank: 7
	}),
	'&&': new ConfigObject({
		fn: function and(left, right, obj) {
			return left(obj) && right(obj);
		},
		rank: 11
	}),
	and: new ConfigObject({
		fn: function and(left, right, obj) {
			return left(obj) && right(obj);
		},
		rank: 11
	}),
	'||': new ConfigObject({
		fn: function or(left, right, obj) {
			return left(obj) || right(obj);
		},
		rank: 12
	}),
	or: new ConfigObject({
		fn: function or(left, right, obj) {
			return left(obj) || right(obj);
		},
		rank: 12
	})
});

let compiler = null;

const methods = new Config({
	join: function (glue, ...args) {
		return args.join(glue);
	},
	sum: function (...args) {
		return args.reduce((agg, v) => agg + v);
	}
});

const expressions = new Config({
	accessor: function (token) {
		const getter = makeGetter(token.value);

		getter.name = 'getter:' + token.value;

		return [new Expressable('value', getter)];
	},

	constant: function (token) {
		const loading = token.metadata.subtype.toLowerCase();
		const fn = constants.get(loading);

		if (!fn) {
			throw new Error('Unable to load constant: ' + loading);
		}

		return [new Expressable('value', fn(token.value))];
	},

	operation: function (token) {
		const loading = token.value.toLowerCase();

		try {
			const {fn, rank} = operations.get(loading);

			return [new Expressable('operation', fn, rank)];
		} catch (ex) {
			throw new Error('Unable to load operation: ' + loading);
		}
	},

	// TODO: there's one heck of a compiler bug
	method: function (token) {
		let fn = null;

		if (token.value === 'null') {
			fn = () => null;
		} else if (token.value === 'undefined') {
			fn = () => undefined;
		} else {
			const tFn = methods.get(token.metadata.name);

			if (token.metadata.arguments) {
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

expressions.set('block', function (token) {
	return [compiler.buildBlock(compiler.tokenize(token.value).tokens)];
});

module.exports = {
	parsings,
	constants,
	operations,
	methods,
	expressions,
	compiler
};
