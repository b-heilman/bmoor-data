/*
const {expect} = require('chai');

describe('bmoor-data.Expressor', function(){
	const {Expressor} = require('./Expressor.js');

	it('should be defined', function(){
		expect(Expressor).to.exist;
	});

	describe('::express =', function(){
		describe('variables', function(){
			const expressor = new Expressor();

			expressor.compile(
				'$foo = $bar'
			);

			it('should fail with mixed int', function(){
				expect(expressor.express({
					foo: 1,
					bar: 2
				})).to.deep.equal(false);
			});

			it('should succeed with equal int', function(){
				expect(expressor.express({
					foo: 1,
					bar: 1
				})).to.deep.equal(true);
			});

			it('should fail with mixed type', function(){
				expect(expressor.express({
					foo: 1,
					bar: '1'
				})).to.deep.equal(false);
			});
			
			it('should succeed with strings', function(){
				expect(expressor.express({
					foo: '1',
					bar: '1'
				})).to.deep.equal(true);
			});
		});

		describe('constants', function(){
			const expressor = new Expressor();

			it('should fail with a string', function(){
				expressor.compile(
					'foo = $bar'
				);

				expect(expressor.express({
					bar: 'foo2'
				})).to.deep.equal(false);
			});

			it('should succeed with a string', function(){
				expressor.compile(
					'foo = $bar'
				);

				expect(expressor.express({
					bar: 'foo'
				})).to.deep.equal(true);
			});

			it('should fail with an int', function(){
				expressor.compile(
					'123 = $bar'
				);

				expect(expressor.express({
					bar: 1234
				})).to.deep.equal(false);
			});

			it('should succeed with an int', function(){
				expressor.compile(
					'123 = $bar'
				);

				expect(expressor.express({
					bar: 123
				})).to.deep.equal(true);
			});

			it('should fail with an int', function(){
				expressor.compile(
					'123.5 = $bar'
				);

				expect(expressor.express({
					bar: 123.4
				})).to.deep.equal(false);
			});

			it('should succeed with an int', function(){
				expressor.compile(
					'123.5 = $bar'
				);

				expect(expressor.express({
					bar: 123.5
				})).to.deep.equal(true);
			});
		});
	});

	describe('::express &', function(){
		const expressor = new Expressor();

		expressor.compile(
			'$foo = foo & $bar = bar'
		);

		it('should fail with left being false', function(){
			expect(expressor.express({
				foo: 'foo',
				bar: 'nope'
			})).to.deep.equal(false);
		});

		it('should fail with right being false', function(){
			expect(expressor.express({
				foo: 'nope',
				bar: 'bar'
			})).to.deep.equal(false);
		});

		it('should succeed with both being true', function(){
			expect(expressor.express({
				foo: 'foo',
				bar: 'bar'
			})).to.deep.equal(true);
		});

		describe('chained', function(){
			it('should work with three', function(){
				expressor.compile(
					'$eins = 1 & $zwei = 2 & $drei.value = 3'
				);

				expect(expressor.express({
					eins: 1,
					zwei: 2,
					drei: {
						value: 3
					}
				})).to.deep.equal(true);
			});
		});
	});

	describe('::express ()', function(){
		describe('natural order, no precedence', function(){
			const expressor = new Expressor();

			expressor.compile(
				'$eins = 1 & $zwei = 2 | $drei = 3'
			);

			it('should succeed => true & false | true', function(){
				expect(expressor.express({
					eins: 1,
					zwei: 2,
					drei: 3
				})).to.deep.equal(true);
			});

			it('should succeed => true & true | true', function(){
				expect(expressor.express({
					eins: 1,
					zwei: 0,
					drei: 3
				})).to.deep.equal(true);
			});

			it('should fail => false & true | false', function(){
				expect(expressor.express({
					eins: 0,
					zwei: 2,
					drei: 0
				})).to.deep.equal(false);
			});
		});

		describe('defined precedence', function(){
			const expressor = new Expressor();

			it('should succeed => (true & false) | true', function(){
				expressor.compile(
					'($eins = 1 & $zwei = 2) | $drei = 3'
				);

				expect(expressor.express({
					eins: 1,
					zwei: 0,
					drei: 3
				})).to.deep.equal(true);
			});

			it('should succeed => (false & false) | true', function(){
				expressor.compile(
					'($eins = 1 & $zwei = 2) | $drei = 3'
				);

				expect(expressor.express({
					eins: 0,
					zwei: 0,
					drei: 3
				})).to.deep.equal(true);
			});

			it('should fail => false & (false | true)', function(){
				expressor.compile(
					'$eins = 1 & ($zwei = 2 | $drei = 3)'
				);

				expect(expressor.express({
					eins: 0,
					zwei: 0,
					drei: 3
				})).to.deep.equal(false);
			});

			it('should succeed => true & (false | true)', function(){
				expressor.compile(
					'$eins = 1 & ($zwei = 2 | $drei = 3)'
				);

				expect(expressor.express({
					eins: 1,
					zwei: 0,
					drei: 3
				})).to.deep.equal(true);
			});
		});
	});
});
*/