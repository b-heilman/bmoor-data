
class Context {
	constructor(systemContext){
		this.ctx = systemContext;

		this.changes = {};
	}

	async hasPermission(/*permission*/){
		return true;
	}

	// method

	// params
	getParam(name){
		if (this.query && name in this.query){
			return this.query[name];
		} else {
			return null;
		}
	}

	// query
	getQuery(name){
		if (this.query && name in this.query){
			return this.query[name];
		} else {
			return null;
		}
	}

	async getContent(){
		return {};
	}

	async getFile(){
		return null;
	}

	addChange(model, action, datum){
		let modelInfo = this.changes[model];

		if (!modelInfo){
			modelInfo = [];

			this.changes[model] = modelInfo;
		}

		modelInfo.push({
			action,
			datum
		});
	}

	getChanges(){
		return this.changes;
	}
}

module.exports = {
	Context
};
