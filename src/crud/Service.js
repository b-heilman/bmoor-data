
class Service {
	constructor(model, connector){
		this.model = model;
		this.hooks = {};
		this.connector = connector;
	}

	decorate(decoration){
		Object.assign(this, decoration);
	}

	async create(datum, ctx){
		if (this.hooks.beforeCreate){
			await this.hooks.beforeCreate(datum, ctx);
		}

		if (!this.connector){
			throw new Error(`missing create connector for ${this.model.name}`);
		}

		const prepared = await this.connector.prepare({
			method: 'create',
			model: this.model,
			delta: this.model.properties.onCreate(
				this.model.cleanDelta(datum, 'create', ctx),
				ctx
			)
		}, ctx);

		const rtn = await this.model.properties.onRead(
			(await this.connector.execute(prepared))[0],
			ctx
		);

		if (this.hooks.afterCreate){
			await this.hooks.afterCreate(rtn, ctx);
		}

		return rtn;
	}

	async read(id, ctx){
		if (!this.connector){
			throw new Error(`missing read connector for ${this.model.name}`);
		}

		const prepared = await this.connector.prepare({
			method: 'read',
			model: this.model,
			context: {
				[this.model.properties.key]: id
			}
		}, ctx);

		return this.model.properties.onRead(
			(await this.connector.execute(prepared))[0],
			ctx
		);
	}

	async readAll(ctx){
		if (!this.connector){
			throw new Error(`missing readAll connector for ${this.model.name}`);
		}

		const prepared = await this.connector.prepare({
			method: 'read',
			model: this.model,
			context: null
		}, ctx);

		const results = await this.connector.execute(prepared);

		return Promise.all(results.map(
			datum => this.model.properties.onRead(datum, ctx)
		));
	}

	async readMany(ids, ctx){
		if (!this.connector){
			throw new Error(`missing readMany connector for ${this.model.name}`);
		}

		const prepared = await this.connector.prepare({
			method: 'read',
			model: this.model,
			context: {
				[this.model.properties.key]: ids
			}
		}, ctx);

		const results = await this.connector.execute(prepared);

		return Promise.all(results.map(
			datum => this.model.properties.onRead(datum, ctx)
		));
	}

	async query(datum, ctx){
		if (!this.connector){
			throw new Error(`missing query connector for ${this.model.name}`);
		}

		const prepared = await this.connector.prepare({
			method: 'read',
			model: this.model,
			context: this.model.getIndex(datum),
		}, ctx);

		const results = await this.connector.execute(prepared, ctx);

		return Promise.all(results.map(
			datum => this.model.properties.onRead(datum, ctx)
		));
	}

	async update(id, delta, ctx){
		if (!this.connector){
			throw new Error(`missing update connector for ${this.model.name}`);
		}

		const datum = await this.read(id, ctx);

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
				this.model.cleanDelta(delta, 'update'),
				datum,
				ctx
			)
		});

		const rtn = await this.model.properties.onRead(
			(await this.connector.execute(prepared))[0],
			ctx
		);

		if (this.hooks.afterUpdate){
			await this.hooks.afterUpdate(rtn, datum, ctx);
		}

		return rtn;
	}

	async delete(id, ctx){
		if (!this.connector){
			throw new Error(`missing delete connector for ${this.model.name}`);
		}

		const datum = await this.read(id, ctx);

		if (this.hooks.beforeDelete){
			await this.hooks.beforeDelete(datum, ctx);
		}

		await this.model.properties.onDelete(datum, ctx);

		const prepared = await this.connector.prepare({
			method: 'delete',
			model: this.model,
			context: {
				[this.model.properties.key]: id
			}
		}, ctx);

		await this.connector.execute(prepared); // don't care about response if success

		if (this.hooks.afterDelete){
			await this.hooks.afterDelete(datum, ctx);
		}

		return datum;
	}
}

module.exports = {
	Service
};
