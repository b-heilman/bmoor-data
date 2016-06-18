console.log('We are running speed tests');

function run( count ){
	var i, c,
		t,
		arr = [];

	for( i = 0, c = count; i < c; i++ ){
		arr.push( {id:i,type:i%10,junk:'woot',foo:'bar'} );
	}

	console.time('collection-consume:'+count);
	t = new bmoorData.Collection();
	t.consume(arr);
	console.timeEnd('collection-consume:'+count);
	console.log( t.length === count ? 'valid' : 'failed' );

	console.time('hashed:'+count);
	t = new bmoorData.HashedCollection(new bmoorData.Hasher(['id']));
	t.consume( arr );
	console.timeEnd('hashed:'+count);
	console.log( t.length === count ? 'valid' : 'failed' );

	console.time('index:'+count);
	t = new bmoorData.Index(new bmoorData.Hasher(['id']));
	t.consume( arr );
	console.timeEnd('index:'+count);
	console.log( Object.keys(t.collections).length === count ? 'valid' : 'failed' );

	console.time('index(10):'+count);
	t = new bmoorData.Index(new bmoorData.Hasher(['type']));
	t.consume( arr );
	console.timeEnd('index(10):'+count);
	console.log( Object.keys(t.collections).length === 10 ? 'valid' : 'failed' );
}

run( 1000 );
run( 10000 );
run( 100000 );

