
const error = require('bmoor/src/lib/error.js');
const {Config} = require('bmoor/src/lib/config.js');

const config = new Config();

// -- post
// create => POST: ''

// -- get: read, readMany, readAll, query
// ? how to apply query to sub select of all / many / event read
// read => GET: '/'+[id]
// readMany => GET: '/'+[id1,id2,id3]
// readAll => GET: ''
// ! these are secured by after read filter

// -- put: update
// update => PUT: '/'+[id] -> send full update
// update => PATCH: '/'+[id] -> send merge content
// ! allow PUT to act like patch

// -- delete: delete
// ? how to apply query to sub select of all / many / event read
// delete => DELETE: '/'+[id]
// delete => DELETE: '/'+[id1,id2]
// delete => DELETE: ''+query

function runUpdate(ids, service, delta, ctx){
	if (ids.length > 1){
		return Promise.all(ids.map(
			id => service.update(id, datum, ctx)
		));
	} else if (ids === 1){
		return service.update(id, datum, ctx);
	} else {
		throw error.create('called update without id', {
			code: 'CRUD_CONTROLLER_WRITE_ID',
			type: 'warn',
			status: 400
		});
	}
}

class Controller {
	constructor(service, nexus, settings){
		this.service = service;
		this.nexus = nexus;
		this.settings = settings;
	}

	async read(ctx){
		if (ctx.method === 'get'){
			if (ctx.query){
				return this.service.query(ctx.query, ctx);
			} else if (ctx.params){
				const ids = ctx.getParam('id').split(',');

				if (ids.length > 1){
					return this.service.readMany(ids, ctx);
				} else if (ids.length){
					return this.service.read(ids, ctx)
					.then(res => {
						if (!res){
							throw error.create('called read without result', {
								code: 'CRUD_CONTROLLER_READ_ONE',
								type: 'warn',
								status: 404
							});
						}

						return res;
					});
				} else {
					throw error.create('called read without id', {
						code: 'CRUD_CONTROLLER_READ_ID',
						type: 'warn',
						status: 400
					});
				}
			} else {
				return this.service.readAll(ctx);
			}
		} else {
			throw error.create('called read with method '+ctx.method, {
				code: 'CRUD_CONTROLLER_READ_UNAVAILABLE',
				type: 'warn',
				status: 405
			});
		}
	}

	async write(ctx){
		const datum = await ctx.getContent();

		if (ctx.method === 'POST'){
			return this.service.create(datum, ctx);		
		} else if (ctx.method === 'PUT'){
			return runUpdate(ctx.getParam('id').split(','), this.service, datum, ctx);
		} else if (ctx.method === 'PATCH'){
			return runUpdate(ctx.getParam('id').split(','), this.service, datum, ctx);
		} else {
			throw error.create('called write with method '+ctx.method, {
				code: 'CRUD_CONTROLLER_WRITE_UNAVAILABLE',
				type: 'warn',
				status: 405
			});
		}
	}

	async delete(ctx){

	}
}

module.exports = {
	Controller
};
