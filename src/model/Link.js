
class Link {
	constructor(name){
		this.name = name;
		this.joins = [];
		this.hash = {};
	}

	addLink(local, name, remote, metadata={}){
		const existing = this.hash[name];

		const join = {
			name,
			local,
			remote,
			metadata
		};

		if (existing){
			existing.push(join);
		} else {
			this.hash[name] = [join];
		}
		
		this.joins.push(join);
	}

	connectsTo(name){
		return this.hash[name] || null;
	}
}

module.exports = {
	Link
};
