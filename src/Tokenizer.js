
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

function tokenize(str, ops) {
	const keys = Object.keys(ops);

	const rtn = str.split('')
	.reduce((agg, char) => {
		let tokenType = null;

		for(let i = 0, c = keys.length; i < c && tokenType === null; i++){
			let type = keys[i];

			if (ops[type](char, agg.last)){
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

const isCharacter = /[\w\.]/;

class Tokenizer {
	constructor(ops = {}){
		this.ops = ops;

		if (!ops.tokens){
			ops.tokens = {
				'variable': function(ch, current){
					return (
						current && current.type === 'variable' && isCharacter.test(ch)  
					) || (ch === '$');
				},
				'string': function(ch){
					return isCharacter.test(ch);
				},
				'comma': function(ch){
					return ch === ',';
				},
				'compare': function(ch){
					return /=|~/.test(ch);
				},
				'operator': function(ch){
					return /\+|-|\*|\/|\^|\||\&/.test(ch);
				},
				'groupOpen': function(ch){
					return (ch === '(');
				},
				'groupClose': function(ch){
					return (ch === ')');
				}
			};
		}
	}

	tokenize(str){
		return tokenize(str, this.ops.tokens);
	}
}

module.exports = {
	Token,
	Tokenizer
};
