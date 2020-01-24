
const {Config} = require('bmoor/src/lib/config.js');

const isCharacter = /[\w\.]/;

const config = new Config({
	tokens: {
		'accessor': function(ch){
			return ch === '$';
		},
		'string': function(ch){
			return isCharacter.test(ch);
		},
		'comma': function(ch){
			return ch === ',';
		},
		'escape': function(ch){
			return ch === '\\';
		},
		'operations': function(ch){
			return /\+|-|\*|\/|\^|\||\&|=|~|<|>|\!/.test(ch);
		},
		'groupOpen': function(ch){
			return (ch === '(');
		},
		'groupClose': function(ch){
			return (ch === ')');
		}
	},
	combinations: {
		method: ['string', 'groupOpen', '*', 'groupClose'],
		group: ['groupOpen', '*', 'groupClose'],
		variable: ['accessor', 'string']
	},
	reductions: {
		operations: {
			relational: ['==','>=', '<=', '>', '<', '!='],
			logical: ['&&', '||'],
			arithmetic: ['+', '-', '/', '*']
		}
	}
});

class Token {
	constructor(type, value){
		this.type = type;
		this.value = value;
	}

	append(value){
		this.value += value;
	}

	toJson(){
		return `{"type":"${this.type}", "value":"${this.value}"}`;
	}
}

class Tokenizer {
	constructor(ops = {}){
		this.tokens = ops.tokens || config.get('tokens');
	}

	tokenize(str){
		const tokens = this.tokens;
		const keys = Object.keys(tokens);

		const rtn = str.split('')
		.reduce((agg, char) => {
			let tokenType = null;

			for(let i = 0, c = keys.length; i < c && tokenType === null; i++){
				let type = keys[i];

				if (tokens[type](char, agg.last)){
					tokenType = type;
				}
			}

			if (/\s/.test(char)){
				if (agg.last){
					agg.tokens.push(agg.last);
				}
				
				agg.last = null;
			} else if (agg.last){
				if (agg.last.type === tokenType){
					agg.last.append(char);
				} else {
					agg.tokens.push(agg.last);
					agg.last = new Token(tokenType, char);
				}
			} else {
				agg.last = new Token(tokenType, char);
			}

			return agg;
		}, {last:null, tokens:[]});

		if (rtn.last){
			rtn.tokens.push(rtn.last);
		}

		return rtn.tokens;
	}

	/*reduce(tokens){

	}*/
}

module.exports = {
	Token,
	Tokenizer
};
