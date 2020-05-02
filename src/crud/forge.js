
const {hook} = require('./hook.js');

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
				return this.messageBus.triggerEvent(ref, 'update', datum, was, ctx);
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
				)
			})
		);
	}
}
