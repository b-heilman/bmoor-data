class Protoken {
	constructor(type, rule, master, open, state) {
		this.type = type;

		this.open = open.pos;
		this.begin = open.begin;

		for (let p = this.open, l = master.length; p < l; p++) {
			const char = master[p];

			let close = rule.close(master, p, state);
			if (close) {
				this.close = close.pos;
				this.end = close.end;

				p = l;
			}

			state.last = char;
		}

		if (!this.end) {
			this.close = master.length;
			this.end = master.length - 1;
		}

		this.token = rule.toToken(
			master.substring(this.begin, this.end + 1),
			state
		);
		this.token.setState(state);
	}

	toJSON() {
		return {
			type: this.type,
			token: this.token ? this.token.toJSON() : null
		};
	}
}

module.exports = {
	Protoken
};
