
class Token {
	constructor(type, value, metadata = null){
		this.type = type;
		this.value = value;
		this.metadata = metadata;
	}

	assign(properties){
		return Object.assign(this.metadata, properties);
	}

	toJSON(){
		return {
			type: this.type,
			value: this.value,
			metadata: this.metadata
		};
	}
}

module.exports = {
	Token
};
