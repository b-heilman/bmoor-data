
const {Config} = require('bmoor/src/lib/config.js');

const isPath = /[\w\.]/;
const isDigit = /\d/;
const isCharacter = /[\w]/;
const isQuote = /"|'|`/;
const isOperator = /\+|-|\*|\/|\^|\||\&|=|~|<|>|\!/;

const escapeChar = '\\';

const {Token} = require('./Token.js'); 

const config = new Config({
	// state = {last}
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

class Protoken {
	constructor(type, char, rule){
		this.type = type;
		this.rule = rule;
		this.state = {};
		this.buffer = char;
	}

	setState(state){
		this.state = state;
	}

	check(char){
		let rtn = true;

		this.buffer += char;

		if (this.rule.end(char, this.state)){
			this.lock();

			rtn = false;
		}

		this.state.last = char;

		return rtn;
	}

	lock(forced){
		this.token = this.rule.toToken(this.buffer, forced, this.state);
		this.buffer = null;
	}

	toJSON(){
		return {
			type: this.type,
			token: this.token ? this.token.toJSON() : null
		};
	}
}

module.exports = {
	config,
	Protoken
};
