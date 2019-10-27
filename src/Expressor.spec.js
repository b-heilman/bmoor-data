
describe('bmoor-data.Expressor', function(){
	const {Expressor} = require('./Expressor.js');

	it('should be defined', function(){
		expect(Expressor).toBeDefined();
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
				})).toEqual(false);
			});

			it('should succeed with equal int', function(){
				expect(expressor.express({
					foo: 1,
					bar: 1
				})).toEqual(true);
			});

			it('should fail with mixed type', function(){
				expect(expressor.express({
					foo: 1,
					bar: '1'
				})).toEqual(false);
			});
			
			it('should succeed with strings', function(){
				expect(expressor.express({
					foo: '1',
					bar: '1'
				})).toEqual(true);
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
				})).toEqual(false);
			});

			it('should succeed with a string', function(){
				expressor.compile(
					'foo = $bar'
				);

				expect(expressor.express({
					bar: 'foo'
				})).toEqual(true);
			});

			it('should fail with an int', function(){
				expressor.compile(
					'123 = $bar'
				);

				expect(expressor.express({
					bar: 1234
				})).toEqual(false);
			});

			it('should succeed with an int', function(){
				expressor.compile(
					'123 = $bar'
				);

				expect(expressor.express({
					bar: 123
				})).toEqual(true);
			});

			it('should fail with an int', function(){
				expressor.compile(
					'123.5 = $bar'
				);

				expect(expressor.express({
					bar: 123.4
				})).toEqual(false);
			});

			it('should succeed with an int', function(){
				expressor.compile(
					'123.5 = $bar'
				);

				expect(expressor.express({
					bar: 123.5
				})).toEqual(true);
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
			})).toEqual(false);
		});

		it('should fail with right being false', function(){
			expect(expressor.express({
				foo: 'nope',
				bar: 'bar'
			})).toEqual(false);
		});

		it('should succeed with both being true', function(){
			expect(expressor.express({
				foo: 'foo',
				bar: 'bar'
			})).toEqual(true);
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
				})).toEqual(true);
			});
		});
	});
});
