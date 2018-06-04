const bmoor = require('bmoor');

module.exports = {
	fn: function( dex, parent, settings ){
		var child;

		settings = Object.assign(
			{
				follow: function(){
					// TODO: does go actually need to be called?
					child.go();
				},
				insert: function( datum ){
					if ( dex.go(datum) ){
						child.add( datum );
					}
				}
			},
			settings
		);

		child = parent.getChild( settings );

		child.go = bmoor.flow.window(function(){
			var datum,
				arr = parent.data;

			child.empty();

			if ( settings.before ){
				settings.before();
			}

			for ( let i = 0, c = arr.length; i < c; i++ ){
				datum = arr[i];
				if ( dex.go(datum) ){
					child.add(datum);
				}
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
