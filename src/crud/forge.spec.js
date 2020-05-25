
const {expect} = require('chai');
// const sinon = require('sinon');

const {Bus} = require('./bus.js');
const {Nexus} = require('./nexus.js');
const {Context} = require('./context.js');

const sut = require('./forge.js');

describe('bmoor-data::crud/forge.js', function(){
	let bus = null;
	let stubs = null;
	let nexus = null;
	let forge = null;

	beforeEach(function(){
		stubs = {};

		bus = new Bus();
		nexus = new Nexus();

		forge = new sut.Forge(nexus, bus);		
	});

	afterEach(function(){
		Object.values(stubs)
		.forEach(stub => stub.restore());
	});

	describe('eventing', function(){
		let ctx = null;

		let service1 = null;
		let service2 = null;

		let interface1 = null;
		let interface2 = null;

		beforeEach(async function(){
			ctx = new Context();

			nexus.setModel('service-1', {
				fields: {
					eins: {
						create: false,
						read: true,
						update: false,
						delete: true,
						key: true
					},
					zwei: true,
					drei: false,
					fier: {
						create: true,
						read: true,
						update: false
					},
					funf: {
						create: true,
						read: true,
						update: false,
						index: true
					}
				}
			});

			nexus.setModel('service-2', {
				fields: {
					eins: {
						create: false,
						read: true,
						update: false,
						delete: true,
						key: true
					},
					zwei: true,
					drei: false,
					fier: {
						create: true,
						read: true,
						update: false
					},
					funf: {
						create: true,
						read: true,
						update: false,
						index: true
					}
				}
			});

			interface1 = {};
			interface2 = {};

			service1 = await nexus.installService('service-1', interface1);
			service2 = await nexus.installService('service-2', interface2);
		});

		describe('::configure', function(){
			it('should allow for the subscription of afterCreate events', async function(){
				interface1.prepare = () => Promise.resolve('foo-bar');
				interface1.execute = () => Promise.resolve([{
					foo: 'bar'
				}]);

				bus.broadcast.on('service-1.create', function(datum, myCtx){
					expect(datum)
					.to.deep.equal({foo: 'bar'});

					expect(ctx)
					.to.equal(myCtx);

					myCtx.addChange('foo', 'bar', {hello: 'world'});
				});

				await forge.configure('service-1');

				const res = await service1.create({eins: 1}, ctx);

				expect(res)
				.to.deep.equal({foo: 'bar'});

				expect(ctx.getChanges())
				.to.deep.equal({
					'service-1': [{
						action: 'create',
						datum: {foo: 'bar'}
					}],
					'foo': [{
						action: 'bar',
						datum: {hello: 'world'}
					}]
				});
			});

			it('should allow for the subscription of afterUpdate events', async function(){
				
			});

			it('should allow for the subscription of afterDelete events', async function(){
				
			});
		});
	});
});