
const {Network} = require('../model/Network.js');

async function getDatum(service, key, otherwise){
	return(
		(key && typeof(key) !== 'object') ?
		await service.read(key) : (await service.query(otherwise))[0]
	);
}
/**
{
	[service-name]: [{
		$ref: <reference>,
		$type: [create, read, update],
		[model.key]: <value>,
		... rest of datum
	}]
}
**/
async function install(action, service, master, mapper){
	let ref = action.$ref;
	let datum = null;

	if (action.$type === 'read'){
		// either search by key, or the whop thing sent in
		datum = await getDatum(service, action[service.model.properties.key], action);
	} else if (action.$type === 'update'){
		const key = action[service.model.properties.key];

		// allows you to do something like update by name, but also change the name by overloading
		// the key
		const current = await getDatum(service, key, key);

		datum = await service.update(current[service.model.properties.key], action);
	} else {
		datum = await service.create(action);
	}

	mapper.getByDirection(service.model.name, 'incoming')
	.forEach(link => {
		const targets = master[link.name];

		if (!targets){
			return;
		}

		targets.forEach(target => {
			if (target[link.remote] === ref){
				target[link.remote] = datum[link.local];
			}
		});
	});

	return datum;
}

// take a master datum, and a mapper reference to all classes, and convert that
// into a series of service calls
function inflate(master, mapper, registry){
	const references = Object.keys(master);
	const network = new Network(mapper);

	const order = network.search(references, 1)
		.map(link => link.name);

	if (order.length !== references.length){
		throw new Error('magical pivot tables are not yet supported');
	}

	return order.reduce(
		(prom, serviceName) => {
			const service = registry.get(serviceName);

			return master[serviceName].reduce(
				(agg, datum) => agg.then(
					() => install(
						datum,
						service,
						master,
						mapper
					)
				), prom
			);
		}, Promise.resolve(true)
	);
}

module.exports = {
	inflate
};
