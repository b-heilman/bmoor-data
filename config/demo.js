var bmoorData = require('../bmoor-data.js');
function run( count ){
	var i, c,
		t,
		arr;

	console.time('collection-init:'+count);
	arr = [];
	for( i = 0, c = count; i < c; i++ ){
		arr.push( {id:i,type:i%10,junk:'woot',foo:'bar'} );
	}

	t = new bmoorData.Collection(arr);
	console.timeEnd('collection-init:'+count);
	console.log( t.data.length === count ? 
		'valid' : 'failed: '+t.data.length );

	//--------

	console.time('collection-consume:'+count);
	arr = [];
	for( i = 0, c = count; i < c; i++ ){
		arr.push( {id:i,type:i%10,junk:'woot',foo:'bar'} );
	}

	t = new bmoorData.Collection();
	t.consume(arr);
	console.timeEnd('collection-consume:'+count);
	console.log( t.data.length === count ? 
		'valid' : 'failed: '+t.data.length );

	//--------

	console.time('collection-add:'+count);
	arr = [];
	t = new bmoorData.Collection();
	for( i = 0, c = count; i < c; i++ ){
		t.add( {id:i,type:i%10,junk:'woot',foo:'bar'} );
	}
	console.timeEnd('collection-add:'+count);
	console.log( t.data.length === count ? 
		'valid' : 'failed: '+t.data.length );

	//--------

	console.time('collection-push:'+count);
	arr = [];
	t = new bmoorData.Collection(arr);
	for( i = 0, c = count; i < c; i++ ){
		arr.push( {id:i,type:i%10,junk:'woot',foo:'bar'} );
	}
	console.timeEnd('collection-push:'+count);
	console.log( t.data.length === count ? 
		'valid' : 'failed: '+t.data.length );

	//--------

	console.time('collection-filter:'+count);
	arr = t.filter(function( d ){
		return d.id % 2;
	});
	console.timeEnd('collection-filter:'+count);
	console.log( arr.data.length * 2 === count ? 
		'valid' : 'failed: '+arr.data.length );

	//--------

	console.time('collection-index:'+count);
	arr = t.index(function( d ){
		return d.id;
	});

	console.timeEnd('collection-index:'+count);
	console.log( arr.keys().length === count ? 
		'valid' : 'failed: '+arr.keys().length );

	//--------

	console.time('collection-route:'+count);
	arr = t.route(function( d ){
		return d.type;
	});
	console.timeEnd('collection-route:'+count);
	console.log( arr.get(0).data.length * 10 === count ? 
		'valid' : 'failed: '+ arr.get(0).data.length );
}

window.stressTest = function(){
	console.log( '===== 1000 =====' );
	run( 1000 );

	console.log( '===== 10000 =====' );
	run( 10000 );

	console.log( '===== 100000 =====' );
	run( 100000 );
};
