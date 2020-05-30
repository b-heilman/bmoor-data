
const error = require('bmoor/src/lib/error.js');
const {Config} = require('bmoor/src/lib/config.js');

const config = new Config({
	putIsPatch: true
});

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

function operationNotAllowed(operation){
	throw error.create(`Operation (${operation}) is blocked`, {
		code: 'CRUD_CONTROLLER_GUARDED',
		type: 'warn',
		status: 400
	});
}

function runUpdate(ids, service, delta, ctx){
	if (ids.length > 1){
		return Promise.all(ids.map(
			id => service.update(id, datum, ctx)
		));
	} else if (ids === 1){
		return service.update(ids[0], datum, ctx);
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
		this.nexus = nexus;
		this.service = service;
		this.settings = settings;
	}

	async read(ctx){
		if (ctx.method === 'get'){
			if (!this.settings.read){
				operationNotAllowed('read');
			}

			if (ctx.query){
				if (!this.settings.query){
					operationNotAllowed('query');
				}

				return this.service.query(ctx.query, ctx);
			} else if (ctx.params){
				const ids = ctx.getParam('id').split(',');

				if (ids.length > 1){
					return this.service.readMany(ids, ctx);
				} else if (ids.length){
					return this.service.read(ids[0], ctx)
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

		if (ctx.method === 'post'){
			if (!this.settings.create){
				operationNotAllowed('create');
			}

			return this.service.create(datum, ctx);
		} else if (ctx.method === 'put'){
			if (!this.settings.update){
				operationNotAllowed('update');
			}

			if (config.get('putIsPatchu')){
				return runUpdate(ctx.getParam('id').split(','), this.service, datum, ctx);
			} else {
				throw error.create('called write and tried to put, not ready', {
					code: 'CRUD_CONTROLLER_WRITE_NOTREADY',
					type: 'warn',
					status: 404
				});
			}
			
		} else if (ctx.method === 'patch'){
			if (!this.settings.update){
				operationNotAllowed('update');
			}

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
		if (ctx.method === 'delete'){
			const ids = ctx.getParam('id').split(',');

			if (!this.settings.delete){
				operationNotAllowed('delete');
			}

			if (ctx.query){
				if (!this.settings.query){
					operationNotAllowed('query');
				}

				const queriedIds = (await this.service.query(ctx.query, ctx))
					.map(datum => this.service.model.getKey(datum));

				return Promise.all(queriedIds.map(
					id => service.delete(id, ctx)
				));
			} else if (ids.length > 1){
				return Promise.all(ids.map(
					id => service.delete(id, ctx)
				));
			} else if (ids === 1){
				return service.delete(ids[0], ctx);
			} else {
				throw error.create('called update without id', {
					code: 'CRUD_CONTROLLER_DELETE_ID',
					type: 'warn',
					status: 400
				});
			}
		} else {
			throw error.create('called write with method '+ctx.method, {
				code: 'CRUD_CONTROLLER_WRITE_UNAVAILABLE',
				type: 'warn',
				status: 405
			});
		}
	}

	getConfig(){
		const read = this.read.bind(this);
		const write = this.write.bind(this);
		const delete = this.delete.bind(this);

		return [{
			method: 'post',
			url: '',
			fn: write
		}, {
			method: 'get',
			url: '/:id',
			fn: read
		}, {
			method: 'get',
			url: '',
			fn: read
		}, {
			method: 'put',
			url: '/:id',
			fn: write
		}, {
			method: 'patch',
			url: '/:id',
			fn: write
		}, {
			method: 'delete',
			url: '/:id',
			fn: delete
		}, {
			method: 'delete',
			url: '',
			fn: delete
		}];
	}
}

module.exports = {
	Controller
};
