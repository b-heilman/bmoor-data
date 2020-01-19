
const {Config} = require('bmoor/src/lib/config.js');

const config = new Config({
	registry: new Config()
});

class Service {
	constructor(model, connector){
		this.model = model;
		this.hooks = {};
		this.connector = connector;
	}

	decorate(decoration){
		Object.assign(this, decoration);
	}

	async create(datum){
		if (this.hooks.beforeCreate){
			await this.hooks.beforeCreate(datum);
		}

		const prepared = await this.connector.prepare({
			method: 'create',
			model: this.model,
			delta: this.model.properties.onCreate(
				this.model.cleanDelta(datum, 'create')
			)
		});

		const rtn = await this.model.properties.onRead(
			(await this.connector.execute(prepared))[0]
		);

		if (this.hooks.afterCreate){
			await this.hooks.afterCreate(rtn);
		}

		return rtn;
	}

	async read(id){
		const prepared = await this.connector.prepare({
			method: 'read',
			model: this.model,
			context: {
				[this.model.properties.key]: id
			}
		});

		return this.model.properties.onRead(
			(await this.connector.execute(prepared))[0]
		);
	}

	async readAll(){
		const prepared = await this.connector.prepare({
			method: 'read',
			model: this.model,
			context: null
		});

		const results = await this.connector.execute(prepared);

		return Promise.all(results.map(this.model.properties.onRead));
	}

	async readMany(ids){
		const prepared = await this.connector.prepare({
			method: 'read',
			model: this.model,
			context: {
				[this.model.properties.key]: ids
			}
		});

		const results = await this.connector.execute(prepared);

		return Promise.all(results.map(this.model.properties.onRead));
	}

	async query(datum){
		const prepared = await this.connector.prepare({
			method: 'read',
			model: this.model,
			context: this.model.getIndex(datum),
		});

		const results = await this.connector.execute(prepared);

		return Promise.all(results.map(this.model.properties.onRead));
	}

	async update(id, delta){
		const datum = await this.read(id);

		if (this.hooks.beforeUpdate){
			await this.hooks.beforeUpdate(delta, datum);
		}

		const prepared = await this.connector.prepare({
			method: 'update',
			model: this.model,
			context: {
				[this.model.properties.key]: id
			},
			delta: this.model.properties.onUpdate(
				this.model.cleanDelta(delta, 'update'), datum
			)
		});

		const rtn = await this.model.properties.onRead(
			(await this.connector.execute(prepared))[0]
		);

		if (this.hooks.afterUpdate){
			await this.hooks.afterUpdate(rtn, datum);
		}

		return rtn;
	}

	async delete(id){
		const datum = await this.read(id);

		if (this.hooks.beforeDelete){
			await this.hooks.beforeDelete(datum);
		}

		const prepared = await this.connector.prepare({
			method: 'delete',
			model: this.model,
			context: {
				[this.model.properties.key]: id
			}
		});

		await this.model.properties.onDelete(
			(await this.connector.execute(prepared))[0]
		);

		if (this.hooks.afterDelete){
			await this.hooks.afterDelete(datum);
		}

		return datum;
	}
}

module.exports = {
	config,
	Service
};
