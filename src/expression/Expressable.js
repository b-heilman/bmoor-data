
class Expressable {
	constructor(type, method, rank = null){
		this.type = type;
		this.rank = rank;
		this.method = method;
	}

	eval(...args){
		return this.method(...args);
	}

	prepare(){
		return (...args) => {
			return this.method(...args);
		};
	}

	toJSON(){
		return {type: this.type, method: this.method.name};
	}

	toString(){
		return `{"type":"${this.type}", "method":"${this.method.toString()}"}`;
	}
}

module.exports = {
	Expressable
};
