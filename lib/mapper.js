const bmoor = require('bmoor');

module.exports = {
	fn: function( dex, parent, settings ){
		var child;

		settings = Object.assign(
			{}, 
			{
				insert: function( datum ){
					// I only need to 
					child.add( dex.go(datum) );
				}
				// remove should use a look-aside
			},
			settings
		);

		child = parent.makeChild( settings );

		child.go = bmoor.flow.window(function(){
			var datum,
				arr = parent.data;

			child.empty();

			if ( settings.before ){
				settings.before();
			}

			for ( let i = 0, c = arr.length; i < c; i++ ){
				datum = arr[i];
				
				child.add( dex.go(datum) );
			}

			if ( settings.after ){
				settings.after();
			}

			child.trigger('process');
		}, settings.min||5, settings.max||30);

		child.go.flush();

		return child;
	}
};
