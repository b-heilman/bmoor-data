const {expect} = require('chai');

describe('bmoor-data.object.Proxy', function () {
	const bmoorData = require('../index.js');
	const Proxy = bmoorData.object.Proxy;
	const {isDirty, getChanges} = require('./Proxy.js'); // TODO : map, flatten, , makeMask

	it('should be defined', function () {
		expect(Proxy).to.exist;
	});

	describe('::follow', function () {
		it('should allow ::unfollow', function () {
			let called = false;

			let proxy = new Proxy({
				foo: 'bar'
			});

			proxy.follow((datum) => {
				expect(datum).to.deep.equal({
					foo: 'bar',
					hello: 'world'
				});

				called = true;
			}, 123);

			proxy.getMask().hello = 'world';

			expect(called).to.equal(false);

			proxy.merge();

			expect(called).to.equal(true);

			proxy.unfollow(123);

			called = false;

			proxy.merge({value: 1});

			expect(called).to.equal(false);

			expect(proxy.getDatum()).to.deep.equal({
				foo: 'bar',
				hello: 'world',
				value: 1
			});
		});
	});

	describe('::isDirty', function () {
		it('should work with null', function () {
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy(target),
				mask = proxy.getMask();

			expect(proxy.isDirty()).to.equal(false);

			mask.foo = null;

			expect(proxy.isDirty()).to.equal(true);
		});

		it('should work with string', function () {
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy(target),
				mask = proxy.getMask();

			expect(proxy.isDirty()).to.equal(false);

			mask.hello.cruel = 'world';
			mask.hello.junk = 'it changed';

			expect(proxy.isDirty()).to.equal(true);
		});

		it('should work with null, via static method', function () {
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy(target),
				mask = proxy.getMask();

			expect(isDirty(mask)).to.equal(false);

			mask.foo = null;

			expect(isDirty(mask)).to.equal(true);
		});
	});

	describe('::getChanges', function () {
		it('should work with null', function () {
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy(target),
				mask = proxy.getMask();

			expect(proxy.getChanges()).to.be.undefined;

			mask.foo = null;

			expect(proxy.getChanges()).to.deep.equal({foo: null});
		});

		it('should work if type changes to object', function () {
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy(target),
				mask = proxy.getMask();

			expect(proxy.getChanges()).to.be.undefined;

			mask.foo = {screw: 'trump'};

			expect(proxy.getChanges()).to.deep.equal({
				foo: {screw: 'trump'}
			});
		});

		it('should work if type changes from object', function () {
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy(target),
				mask = proxy.getMask();

			expect(proxy.getChanges()).to.be.undefined;

			mask.hello = 'world';

			expect(proxy.getChanges()).to.deep.equal({
				hello: 'world'
			});
		});

		it('should work with null, via static method', function () {
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy(target),
				mask = proxy.getMask();

			expect(proxy.getChanges()).to.be.undefined;

			mask.foo = null;

			expect(proxy.getChanges()).to.deep.equal({foo: null});
		});

		it('should work with null, via static method on mask', function () {
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy(target),
				mask = proxy.getMask();

			expect(getChanges(mask)).to.be.undefined;

			mask.foo = null;

			expect(getChanges(mask)).to.deep.equal({foo: null});
		});

		it('should work with null, via static method on pojo', function () {
			var target = {
				foo: 'bar',
				hello: {
					cruel: 'world',
					junk: 'junk'
				},
				blah: {
					blah: 'blah'
				}
			};

			expect(getChanges(target)).to.deep.equal(target);
		});
	});

	describe('masks', function () {
		it('should obfuscate values correctly', function () {
			var target = {
					first: 1
				},
				proxy = new Proxy(target),
				mask = proxy.getMask();

			mask.second = 2;

			expect(mask.first).to.equal(1);
			expect(mask.second).to.equal(2);
		});

		it('should copy value over from a seed', function () {
			var target = {
					first: 1,
					hello: 'world',
					blar: {}
				},
				proxy = new Proxy(target),
				seed = {
					foo: 'bar',
					blar: null,
					first: 1,
					hello: 'world2'
				},
				mask = proxy.getMask(seed);

			expect(mask.first).to.equal(1);
			expect(mask.foo).to.equal('bar');
			expect(mask.hello).to.equal('world2');
			expect(mask.blar).to.equal(null);

			expect(Object.keys(mask)).to.deep.equal(['blar', 'foo', 'hello']);
		});
	});

	describe('deep masks', function () {
		it('should create masks recursively', function () {
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					}
				},
				proxy = new Proxy(target),
				mask = proxy.getMask();

			expect(mask.hello.hasOwnProperty('cruel')).to.equal(false);
			expect(mask.hello.cruel).to.exist;

			mask.hello.woot = 'ox';
			mask.hello.cruel = 'hi';

			expect(target.hello.cruel).to.equal('world');
			expect(mask.hello.cruel).to.equal('hi');

			expect(target.hello.woot).to.be.undefined;
			expect(mask.hello.woot).to.equal('ox');
		});

		it('should detect changes', function () {
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					},
					blah: {
						blah: 'blah'
					}
				},
				proxy = new Proxy(target),
				mask = proxy.getMask();

			expect(proxy.isDirty()).to.equal(false);
			expect(proxy.getChanges()).to.be.undefined;

			mask.hello.woot = 'ox';
			mask.eins = 'hi';

			expect(proxy.isDirty()).to.equal(true);
			expect(proxy.getChanges()).to.deep.equal({
				hello: {
					woot: 'ox'
				},
				eins: 'hi'
			});
		});
	});

	describe('::map', function () {
		it('should allow default values to be optionally mapped to mask', function () {
			var target = {
					first: 1,
					hello: 'world',
					blar: {
						foo: 'blar'
					}
				},
				proxy = new Proxy(target),
				seed = {
					second: 2,
					blar: {
						foo: 'blar'
					},
					hello: 'world'
				},
				mask = proxy.map(seed);

			expect(mask.first).to.equal(1);
			expect(mask.second).to.equal(2);
			expect(mask.hello).to.equal('world');
			expect(mask.blar).to.deep.equal({foo: 'blar'});

			expect(Object.keys(mask)).to.deep.equal(['blar', 'second']);
			expect(proxy.getChanges()).to.deep.equal({second: 2});
		});
	});

	describe('::merge', function () {
		it('should not call update if no changes are merged', function () {
			var called = false,
				target = {
					foo: 'bar',
					hello: 'world'
				},
				proxy = new Proxy(target);

			proxy.subscribe(function () {
				called = true;
			});

			proxy.merge({foo: 'bar'});

			expect(called).to.equal(false);

			proxy.merge({foo: 'bared'});

			expect(called).to.equal(true);
		});

		it('should not call update if no changes are merged', function () {
			var called = false,
				target = {
					foo: 'bar',
					hello: 'world'
				},
				proxy = new Proxy(target),
				mask = proxy.getMask();

			proxy.subscribe(function () {
				called = true;
			});

			mask.foo = 'bar';
			proxy.merge();

			expect(called).to.equal(false);

			mask.foo = 'bared';
			proxy.merge();

			expect(called).to.equal(true);
		});
	});

	describe('::flatten', function () {
		it('should copy in objects', function () {
			var target = {
					foo: 'bar',
					obj: {
						eins: 1,
						zwei: 2
					},
					boop: 'bop'
				},
				proxy = new Proxy(target),
				res = proxy.flatten({
					foo: 'bar2',
					hello: 'world',
					obj: {
						drei: 3
					}
				});

			target.eins = 10;

			expect(res.foo).to.equal('bar2');
			expect(res.obj.eins).to.equal(1);
			expect(res.obj.zwei).to.equal(2);
			expect(res.obj.drei).to.equal(3);
			expect(res.hello).to.equal('world');
			expect(res.boop).to.equal('bop');
		});

		it('should copy in objects', function () {
			var target = {
					foo: 'bar',
					obj: {
						eins: 1,
						zwei: 2
					},
					boop: 'bop'
				},
				proxy = new Proxy(target);

			proxy.getMask({
				foo: 'bar2',
				hello: 'world',
				obj: {
					drei: 3
				}
			});

			let res = proxy.flatten();

			target.eins = 10;

			expect(res.foo).to.equal('bar2');
			expect(res.obj.eins).to.equal(1);
			expect(res.obj.zwei).to.equal(2);
			expect(res.obj.drei).to.equal(3);
			expect(res.hello).to.equal('world');
			expect(res.boop).to.equal('bop');
		});
	});

	describe('$ for accessing', function () {
		it('should work on a base level', function () {
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					}
				},
				proxy = new Proxy(target);

			expect(proxy.$('foo')).to.equal('bar');
		});

		it('should work on a multi levels', function () {
			var target = {
					foo: 'bar',
					hello: {
						cruel: 'world',
						junk: 'junk'
					}
				},
				proxy = new Proxy(target);

			expect(proxy.$('hello.cruel')).to.equal('world');
		});
	});

	describe('extending Proxy', function () {
		class MyProxy extends Proxy {
			constructor(delta) {
				super(delta);

				if (delta.foo) {
					this.eins = delta.foo;
				}

				if (delta.bar) {
					this.zwei = delta.bar;
				}
			}

			merge(delta) {
				super.merge(delta);

				if (delta.foo) {
					this.eins = delta.foo;
				}

				if (delta.bar) {
					this.zwei = delta.bar;
				}
			}
		}

		it('should work on a base level', function () {
			var target = {
					foo: 'bar'
				},
				proxy = new MyProxy(target);

			expect(proxy.eins).to.equal('bar');
			expect(proxy.zwei).to.be.undefined;

			proxy.merge({foo: 'bar2', bar: 'doo'});

			expect(proxy.eins).to.equal('bar2');
			expect(proxy.zwei).to.equal('doo');

			proxy.merge({bar: 'doo2'});

			expect(proxy.eins).to.equal('bar2');
			expect(proxy.zwei).to.equal('doo2');
		});
	});
});
