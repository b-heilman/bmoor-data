
const {Token} = require('./Token.js');

class Compound extends Token {
	// same constructor as Token, but value is an array of sub-tokens

	toJSON(){
		return {
			type: this.type,
			value: this.value.map(token => token.toJSON()),
			metadata: this.metadata
		};
	}
}

module.exports = {
	Token
};
