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
					child.add( datum );
					child.go();
				},
				update: function(){
					child.go();
				}
			},
			settings
		);

		child = parent.getChild( settings );

		for( var i = 0, c = parent.data.length; i < c; i++ ){
			child.add( parent.data[i] );
		}

		child.go = bmoor.flow.window(function(){
			if ( settings.before ){
				settings.before();
			}

			child.data.sort( dex.go );

			if ( settings.after ){
				settings.after();
			}

			child.trigger('process');
		}, settings.min||5, settings.max||30);

		child.go.flush();

		return child;
	}
};
