
const {expect} = require('chai');
const sinon = require('sinon');

const {Nexus} = require('../nexus.js');
const {Context} = require('../context.js');

const sut = require('./utility.js');

describe('src/crud/controller/utility.js', function(){
	let stubs = {};
	let nexus = null;
	let service = null;
	let interface = null;

	beforeEach(async function(){
		stubs = {};

		nexus = new Nexus();

		nexus.setModel('service-1', {
			fields: {
				id: {
					create: false,
					read: true,
					update: false,
					key: true
				},
				name: {
					create: false,
					read: false,
					update: false,
					query: true
				}
			}
		});

		interface = {};
			
		service = await nexus.installService('service-1', interface);
	});

	afterEach(function(){
		Object.values(stubs)
		.forEach(stub => stub.restore());
	});

	describe('allowing for a method to be called', function(){
		const {Utility} = sut;

		it('should work', async function(){
			let called = false;

			stubs.read = sinon.stub(service, 'read')
			.resolves({id: 'eins', name: 'hello-world'});

			service.fooBar = function(){
				called = true;

				return 'eins-zwei';
			};

			const utility = new Utility(service, {
				'foo-bar': {
					method: 'get'
				}
			});

			const context = new Context({
				method: 'get',
				params: {
					id: 1234,
					utility: 'foo-bar'
				}
			});

			const res = await utility.route(context);

			expect(called)
			.to.equal(true);

			expect(res)
			.to.equal('eins-zwei');
		});

		it('should fail if permission fails', async function(){
			let called = false;

			stubs.read = sinon.stub(service, 'read')
			.resolves({id: 'eins', name: 'hello-world'});

			service.fooBar = function(){
				called = true;

				return 'eins-zwei';
			};

			const utility = new Utility(service, {
				'foo-bar': {
					method: 'get',
					permission: 'oh-boy'
				}
			});

			const context = new Context({
				method: 'get',
				params: {
					id: 1234,
					utility: 'foo-bar'
				}
			});

			context.hasPermission = function(perm){
				expect(perm)
				.to.equal('oh-boy');

				return false;
			};

			let failed = false;
			try {
				const res = await utility.route(context);

				expect(called)
				.to.equal(true);

				expect(res)
				.to.equal('eins-zwei');
			} catch(ex){
				failed = true;

				expect(ex.code)
				.to.equal('UTILITY_CONTROLLER_PERMISSION');
			}

			expect(failed)
			.to.equal(true);

			expect(called)
			.to.equal(false);
		});

		it('should succeed if permission allows', async function(){
			let called = false;

			stubs.read = sinon.stub(service, 'read')
			.resolves({id: 'eins', name: 'hello-world'});

			service.fooBar = function(){
				called = true;

				return 'eins-zwei';
			};

			const utility = new Utility(service, {
				'foo-bar': {
					method: 'get',
					permission: 'oh-boy'
				}
			});

			const context = new Context({
				method: 'get',
				params: {
					id: 1234,
					utility: 'foo-bar'
				}
			});

			context.hasPermission = function(perm){
				expect(perm)
				.to.equal('oh-boy');

				return true;
			};

			let failed = false;
			try {
				const res = await utility.route(context);

				expect(called)
				.to.equal(true);

				expect(res)
				.to.equal('eins-zwei');
			} catch(ex){
				failed = true;

				expect(ex.code)
				.to.equal('UTILITY_CONTROLLER_PERMISSION');
			}

			expect(failed)
			.to.equal(false);

			expect(called)
			.to.equal(true);
		});
	});

	it('should fail if a method not defined is called', async function(){
		const {Utility} = sut;

		let called = false;

		const utility = new Utility(service, {
			'foo-bar': {
				method: 'get',
				permission: 'oh-boy'
			}
		});

		const context = new Context({
			method: 'get',
			params: {
				id: 1234,
				utility: 'foo-bar'
			}
		});

		let failed = false;
		try {
			const res = await utility.route(context);

			expect(called)
			.to.equal(true);

			expect(res)
			.to.equal('eins-zwei');
		} catch(ex){
			failed = true;

			expect(ex.code)
			.to.equal('UTILITY_CONTROLLER_METHOD');
		}

		expect(failed)
		.to.equal(true);

		expect(called)
		.to.equal(false);
	});

	it('should fail if an utility not defined is called', async function(){
		const {Utility} = sut;

		let called = false;

		const utility = new Utility(service, {
			'foo-bar': {
				method: 'get',
				permission: 'oh-boy'
			}
		});

		const context = new Context({
			method: 'get',
			params: {
				id: 1234,
				utility: 'foo-bar2'
			}
		});

		let failed = false;
		try {
			const res = await utility.route(context);

			expect(called)
			.to.equal(true);

			expect(res)
			.to.equal('eins-zwei');
		} catch(ex){
			failed = true;

			expect(ex.code)
			.to.equal('UTILITY_CONTROLLER_NO_UTILITY');
		}

		expect(failed)
		.to.equal(true);

		expect(called)
		.to.equal(false);
	});

	it('should fail if the http method is incorrect', async function(){
		const {Utility} = sut;

		let called = false;

		const utility = new Utility(service, {
			'foo-bar': {
				method: 'get',
				permission: 'oh-boy'
			}
		});

		const context = new Context({
			method: 'post',
			params: {
				id: 1234,
				utility: 'foo-bar'
			}
		});

		let failed = false;
		try {
			const res = await utility.route(context);

			expect(called)
			.to.equal(true);

			expect(res)
			.to.equal('eins-zwei');
		} catch(ex){
			failed = true;

			expect(ex.code)
			.to.equal('UTILITY_CONTROLLER_WRONG_METHOD');
		}

		expect(failed)
		.to.equal(true);

		expect(called)
		.to.equal(false);
	});
});
