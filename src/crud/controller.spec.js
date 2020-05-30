
const {Nexus} = require('./nexus.js');
const {Context} = require('./context.js');

const sut = require('./controller.js');

describe('src/crud/Controller.js', function(){
	let nexus = null;
	let context = null;
	let service = null;
	let interface = null;

	beforeEach(async function(){
		context = new Context();

		nexus.setModel('service-1', {
			fields: {
				eins: {
					create: false,
					read: true,
					update: false,
					key: true
				},
				zwei: {
					create: false,
					read: false,
					update: false,
					query: true
				},
			}
		});

		interface = {};
			
		service = await nexus.installService('service-1', interface1);
	});

	describe('::Controller', function(){
		describe('allowing all functionality', function(){
			let controller = null;

			const {Controller} = sut;

			beforeEach(async function(){
				controller = new Controller(service, nexus, {
					read: true,
					query: true,
					create: true,
					update: true,
					delete: true
				});
			});
		});

		describe('blocking query functionality', function(){
			let controller = null;

			const {Controller} = sut;

			beforeEach(async function(){
				controller = new Controller(service, nexus, {
					read: true,
					query: false,
					create: true,
					update: true,
					delete: true
				});
			});
		});
		
		describe('blocking base functionality', function(){
			let controller = null;

			const {Controller} = sut;

			beforeEach(async function(){
				controller = new Controller(service, nexus, {
					read: false,
					query: true,
					create: false,
					update: false,
					delete: false
				});
			});
		});
	});
});
