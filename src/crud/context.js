
class Context {
	constructor(systemContext){
		this.ctx = systemContext;

		this.changes = {};
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

	async hasPermission(/*permission*/){
		return true;
	}
}

module.exports = {
	Context
};
