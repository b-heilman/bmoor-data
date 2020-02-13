
class Protoken {
	constructor(type, char, rule, master){
		this.type = type;
		this.rule = rule;
		this.state = {};
		this.master = master;
		this.buffer = char;
	}

	setState(state){
		this.state = state;
	}

	check(pos){
		const char = this.master[pos];

		let rtn = true;

		this.state.pos = pos;
		this.buffer += char;

		if (this.rule.end(char, this.state, this.master)){
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
	Protoken
};
