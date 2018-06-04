
module.exports = {
	fn: function index( dex, parent ){
		var index = {};

		for( let i = 0, c = parent.data.length; i < c; i++ ){
			let datum = parent.data[i],
				key = dex.go(datum);

			index[ key ] = datum;
		}

		let disconnect = parent.subscribe({
			insert: function( datum ){
				var key = dex.go(datum);
				index[ key ] = datum;
			},
			remove: function( datum ){
				var key = dex.go(datum);
				delete index[ key ];
			}
		});

		return {
			get: function( search ){
				var key = dex.parse(search);
				return index[ key ];
			},
			keys: function(){
				return Object.keys( index );
			},
			disconnect: function(){
				disconnect();
			}
		};
	}
};
