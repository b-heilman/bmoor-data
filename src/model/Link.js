
class Link {
	constructor(name){
		this.name = name;
		this.joins = [];
		this.hash = {};
	}

	addLink(local, name, remote, metadata={}){
		if (this.hash[name]){
			throw new Error('compound keys is not supported');
		}

		const join = {
			name,
			local,
			remote,
			metadata
		};

		this.hash[name] = join;
		
		this.joins.push(join);
	}

	connectsTo(name){
		return this.hash[name] || null;
	}
}

module.exports = {
	Link
};
