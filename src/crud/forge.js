
const {del} = require('bmoor/src/core.js');

const {hook} = require('./hook.js');

function clearFactory(field, permission){
	return async function(datum, ctx){
		const has = await ctx.hasPermission(permission);

		if (!has){
			del(datum, field);
		}
	};
}

class Forge {
	constructor(nexus, messageBus){
		this.nexus = nexus;
		this.messageBus = messageBus;
	}

	async configure(ref){
		const service = await this.nexus.loadService(ref);

		await hook(service, {
			afterCreate: (datum, ctx) => {
				return this.messageBus.triggerEvent(ref, 'create', datum, ctx);
			},
			afterUpdate: (datum, was, ctx) => {
				return this.messageBus.triggerEvent(ref, 'update', datum, ctx, was);
			},
			afterDelete: (datum, ctx) => {
				return this.messageBus.triggerEvent(ref, 'delete', datum, ctx);
			}
		});

		return service;
	}

	/*
	[{
		model:
		action:
		callback: function(service, )	
	}]
	*/
	async subscribe(ref, subscriptions){
		const service = await this.nexus.loadService(ref);

		return Promise.all(
			subscriptions.map(settings => {
				return this.messageBus.addListener(
					settings.model,
					settings.action,
					(...args) => settings.callback(service, ...args)
				);
			})
		);
	}

	async secure(ref){
		const service = await this.nexus.loadService(ref);
		const fields = service.model.settings.fields;

		const beforeCreate = [];
		const beforeQuery = [];
		const beforeUpdate = [];
		const beforeDelete = [];

		for (let [field, info] of Object.entries(fields)) {
			if (typeof(info.create) === 'string'){
				beforeCreate.push(clearFactory(field, info.create));
			}

			if (typeof(field.query) === 'string'){
				beforeQuery.push(clearFactory(field, info.query));
			}

			if (typeof(field.update) === 'string'){
				beforeUpdate.push(clearFactory(field, info.update));
			}

			if (typeof(field.delete) === 'string'){
				beforeDelete.push(clearFactory(field, info.delete));
			}
		}

		await hook(service, {
			beforeCreate: beforeCreate.length ?
				(datum, ctx) => Promise.all(
					beforeCreate.map(fn => fn(datum, ctx))
				) : null,
			beforeQuery: beforeQuery.length ?
				(datum, ctx) => Promise.all(
					beforeQuery.map(fn => fn(datum, ctx))
				) : null,
			beforeUpdate: beforeUpdate.length ?
				(datum, ctx) => Promise.all(
					beforeCreate.map(fn => fn(datum, ctx))
				) : null,
			beforeDelete: beforeDelete.length ?
				(datum, ctx) => Promise.all(
					beforeDelete.map(fn => fn(datum, ctx))
				) : null
		});

		return service;
	}
}

module.exports = {
	Forge
};
