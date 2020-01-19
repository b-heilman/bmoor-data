
const {expect} = require('chai');
const sinon = require('sinon');

const {Model} = require('./Model.js');
const {Service} = require('./Service.js');
const {Config} = require('bmoor/src/lib/config.js');
const {inflate} = require('./Synthetic.js');
const {Mapper} = require('../model/Mapper.js');

describe('bmoor-data::crud/Synthetic', function(){
	let stubs = null;

	beforeEach(function(){
		stubs = {};
	});

	afterEach(function(){
		Object.values(stubs)
		.forEach(stub => stub.restore());
	});

	describe('::inflate', function(){
		let mapper = null;
		let serviceRegistry = null;

		let class1 = null;
		let class2 = null;
		let class3 = null;
		let class4 = null;

		beforeEach(function(){
			const model1 = new Model('class-1', {
				fields: {
					'id': {
						key: true,

					}
				}
			});

			class1 = new Service(model1);

			const model2 = new Model('class-2', {
				fields: {
					id: {
						key: true,
					},

					class1Id: {
						link: {
							name: 'class-1',
							field: 'id'
						}
					}
				}
			});

			class2 = new Service(model2);

			const model3 = new Model('class-3', {
				fields: {

					id: {
						key: true,
					},

					class2Id: {
						link: {
							name: 'class-2',
							field: 'id'
						}
					}
				}
			});

			class3 = new Service(model3);

			const model4 = new Model('class-4', {
				fields: {
					id: {
						key: true,
					},

					class2Id: {
						link: {
							name: 'class-1',
							field: 'id'
						}
					}
				}
			});

			class4 = new Service(model4);

			mapper = new Mapper();
			mapper.addModel(model3);
			mapper.addModel(model1);
			mapper.addModel(model2);
			mapper.addModel(model4);

			serviceRegistry = new Config();
			serviceRegistry.set(model1.name, class1);
			serviceRegistry.set(model2.name, class2);
			serviceRegistry.set(model3.name, class3);
			serviceRegistry.set(model4.name, class4);
		});

		it('should properly process a basic set of models', function(done){
			stubs.class1 = sinon.stub(class1, 'create')
			.resolves({id:123});

			stubs.class2 = sinon.stub(class2, 'create')
			.resolves({id:456});

			stubs.class3 = sinon.stub(class3, 'create')
			.resolves({id:789});

			stubs.class4 = sinon.stub(class4, 'create')
			.resolves({id:0});

			inflate({
				'class-1': [{
					$ref: 'foo-1'
				}],
				'class-2': [{
					$ref: 'bar-2',
					class1Id: 'foo-1'
				}],
				'class-3': [{
					class2Id: 'bar-2',
				}]
			}, mapper, serviceRegistry)
			.then(() => {
				expect(stubs.class1.getCall(0).args[0])
				.to.deep.equal({
					$ref: 'foo-1'
				});

				expect(stubs.class2.getCall(0).args[0])
				.to.deep.equal({
					$ref: 'bar-2',
					class1Id: 123
				});

				expect(stubs.class3.getCall(0).args[0])
				.to.deep.equal({
					class2Id: 456
				});

				done();
			}).catch(done);
		});

		it('should properly process a read (via read) with a set of models', function(done){
			stubs.class1 = sinon.stub(class1, 'read')
			.resolves({id:123});

			stubs.class2 = sinon.stub(class2, 'create')
			.resolves({id:456});

			stubs.class3 = sinon.stub(class3, 'create')
			.resolves({id:789});

			stubs.class4 = sinon.stub(class4, 'create')
			.resolves({id:0});

			inflate({
				'class-1': [{
					$type: 'read',
					$ref: 'foo-1',
					id: 'one'
				}],
				'class-2': [{
					$ref: 'bar-2',
					class1Id: 'foo-1'
				}],
				'class-3': [{
					class2Id: 'bar-2',
				}]
			}, mapper, serviceRegistry)
			.then(() => {
				expect(stubs.class1.getCall(0).args[0])
				.to.equal('one');

				expect(stubs.class2.getCall(0).args[0])
				.to.deep.equal({
					$ref: 'bar-2',
					class1Id: 123
				});

				expect(stubs.class3.getCall(0).args[0])
				.to.deep.equal({
					class2Id: 456
				});

				done();
			}).catch(done);
		});

		it('should properly process a read (via query) with a set of models', function(done){
			stubs.class1 = sinon.stub(class1, 'query')
			.resolves([{id:123}]);

			stubs.class2 = sinon.stub(class2, 'create')
			.resolves({id:456});

			stubs.class3 = sinon.stub(class3, 'create')
			.resolves({id:789});

			stubs.class4 = sinon.stub(class4, 'create')
			.resolves({id:0});

			inflate({
				'class-1': [{
					$type: 'read',
					$ref: 'foo-1',
					blah: 'one'
				}],
				'class-2': [{
					$ref: 'bar-2',
					class1Id: 'foo-1'
				}],
				'class-3': [{
					class2Id: 'bar-2',
				}]
			}, mapper, serviceRegistry)
			.then(() => {
				expect(stubs.class1.getCall(0).args[0])
				.to.deep.equal({
					$type: 'read',
					$ref: 'foo-1',
					blah: 'one'
				});

				expect(stubs.class2.getCall(0).args[0])
				.to.deep.equal({
					$ref: 'bar-2',
					class1Id: 123
				});

				expect(stubs.class3.getCall(0).args[0])
				.to.deep.equal({
					class2Id: 456
				});

				done();
			}).catch(done);
		});

		it('should properly process an update (via read) with a set of models', function(done){
			stubs.class1Read = sinon.stub(class1, 'read')
			.resolves({id:123});

			stubs.class1Update = sinon.stub(class1, 'update')
			.resolves({id:123});

			stubs.class2 = sinon.stub(class2, 'create')
			.resolves({id:456});

			stubs.class3 = sinon.stub(class3, 'create')
			.resolves({id:789});

			stubs.class4 = sinon.stub(class4, 'create')
			.resolves({id:0});

			inflate({
				'class-1': [{
					$type: 'update',
					$ref: 'foo-1',
					id: 'one'
				}],
				'class-2': [{
					$ref: 'bar-2',
					class1Id: 'foo-1'
				}],
				'class-3': [{
					class2Id: 'bar-2',
				}]
			}, mapper, serviceRegistry)
			.then(() => {
				expect(stubs.class1Read.getCall(0).args[0])
				.to.equal('one');

				expect(stubs.class1Update.getCall(0).args[0])
				.to.equal(123);

				expect(stubs.class1Update.getCall(0).args[1])
				.to.deep.equal({
					$type: 'update',
					$ref: 'foo-1',
					id: 'one'
				});

				expect(stubs.class2.getCall(0).args[0])
				.to.deep.equal({
					$ref: 'bar-2',
					class1Id: 123
				});

				expect(stubs.class3.getCall(0).args[0])
				.to.deep.equal({
					class2Id: 456
				});

				done();
			}).catch(done);
		});

		it('should properly process an update (via query) with a set of models', function(done){
			stubs.class1Read = sinon.stub(class1, 'query')
			.resolves([{id:123}]);

			stubs.class1Update = sinon.stub(class1, 'update')
			.resolves({id:123});

			stubs.class2 = sinon.stub(class2, 'create')
			.resolves({id:456});

			stubs.class3 = sinon.stub(class3, 'create')
			.resolves({id:789});

			stubs.class4 = sinon.stub(class4, 'create')
			.resolves({id:0});

			inflate({
				'class-1': [{
					$type: 'update',
					$ref: 'foo-1',
					id: {
						id: 'one'
					}
				}],
				'class-2': [{
					$ref: 'bar-2',
					class1Id: 'foo-1'
				}],
				'class-3': [{
					class2Id: 'bar-2',
				}]
			}, mapper, serviceRegistry)
			.then(() => {
				expect(stubs.class1Read.getCall(0).args[0])
				.to.deep.equal({id:'one'});

				expect(stubs.class1Update.getCall(0).args[0])
				.to.equal(123);

				expect(stubs.class1Update.getCall(0).args[1])
				.to.deep.equal({
					$type: 'update',
					$ref: 'foo-1',
					id: {
						id: 'one'
					}
				});

				expect(stubs.class2.getCall(0).args[0])
				.to.deep.equal({
					$ref: 'bar-2',
					class1Id: 123
				});

				expect(stubs.class3.getCall(0).args[0])
				.to.deep.equal({
					class2Id: 456
				});

				done();
			}).catch(done);
		});
	});
});
