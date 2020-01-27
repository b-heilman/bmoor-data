
const {Config} = require('bmoor/src/lib/config.js');

const isPath = /[\w\.]/;
const isDigit = /\d/;
const isCharacter = /[\w]/;
const isQuote = /"|'|`/;
const isOperator = /\+|-|\*|\/|\^|\||\&|=|~|<|>|\!/;

const escapeChar = '\\';

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
		finish: function(buffer, forced){
			if (forced){
				return buffer.substring(1);
			} else {
				return buffer.substring(1, buffer.length - 1);
			}
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
		finish: function(buffer, forced, state){
			const escape = escapeChar === '\\' ? '\\\\'+state.quote : escapeChar+state.quote;
			
			buffer = buffer.replace(new RegExp(escape,'g'), state.quote);
			
			if (forced){
				return buffer.substring(1, buffer.length-1);
			} else {
				return buffer.substring(1, buffer.length-2);
			}
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
		finish: function(buffer, forced, state){
			if (state.isFloat){
				return parseFloat(buffer);
			} else {
				return parseInt(buffer);
			}
		}
	},

	operation: {
		begin: function(ch){
			return isOperator.test(ch);
		},
		end: function(ch){
			return !isOperator.test(ch);
		},
		finish: function(buffer, forced){
			if (forced){
				return buffer;
			} else {
				return buffer.substring(0, buffer.length-1);
			}
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
		finish: function(buffer, forced){
			if (forced){
				return buffer.substring(0, buffer.length);
			} else {
				return buffer.substring(0, buffer.length-1);
			}
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
		finish: function(buffer){
			return buffer.substring(1, buffer.length-1);
		}
	}
});

class Token {
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
		this.value = this.rule.finish(this.buffer, forced, this.state);
		this.buffer = null;
	}

	toJSON(){
		return {
			type:this.type,
			value:this.value
		};
	}
}

function getToken(char, state){
	const keys = config.keys();

	for (let i = 0, c = keys.length; i < c; i++){
		const key = keys[i];
		const rule = config.get(key);

		if (rule.begin(char, state)){
			return new Token(key, char, rule);
		}
	}

	return null;
}

class Tokenizer {
	constructor(){
	}

	tokenize(str){
		const tokens = [];
		
		let misses = [];
		let state = {};

		for (let pos = 0, c = str.length; pos < c; pos++){
			const char = str[pos];
			const current = getToken(char, state);

			if (current){
				current.setState(state);

				tokens.push(current);

				do {
					pos++;
				} while(pos < c && current.check(str[pos]));

				if (current.value === undefined){
					current.lock(true);
				}

				pos--;
				state = {
					last: str[pos]
				};
			} else {
				misses.push(char);

				state.last = char;
			}
		}

		this.tokens = tokens;

		return misses;
	}
}

module.exports = {
	Token,
	Tokenizer
};
