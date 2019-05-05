const DataProxy = require('../object/Proxy.js'),
	DataCollection = require('../Collection.js');

const defaultSettings = {
	proxyFactory: function( datum ){
		return new DataProxy(datum);
	}
};

function configSettings( settings ){
	if ( !settings ){
		settings = {};
	}

	if ( !('massage' in settings) ){
		settings.massage = function( proxy ){
			return proxy.getDatum();
		};
	}

	return settings;
}

class Proxied extends DataCollection {
	constructor(src, settings){
		super(src, settings);

		if (src){
			this.data.forEach( ( datum, i ) => {
				this.data[i] = this._wrap(datum);
			});
		}
	}

	//--- array methods
	indexOf( obj, start ){
		if ( !start ){
			start = 0;
		}

		if ( obj instanceof DataProxy ){
			return super.indexOf( obj, start );
		}else{
			let c = this.data.length; 
			while( start < c && this.data[start].getDatum() !== obj ){
				start++;
			}

			if ( this.data.length !== start ){
				return start;
			}else{
				return -1;
			}
		}
	}

	mergeChanges(){
		return this.data.map( p => {
			p.merge();

			return p.getDatum();
		});
	}

	flattenAll(){
		return this.data.map( p => {
			return p.flatten();
		});
	}

	//--- collection methods
	_wrap( datum ){
		var proxy;

		if ( datum instanceof DataProxy ){
			proxy = datum;
		} else {
			let factory = this.settings.proxyFactory || defaultSettings.proxyFactory;
			proxy = factory(datum);
		}

		return proxy;
	}

	_add( datum ){
		var proxy = this._wrap(datum);

		return super._add( proxy );
	}

	index( search, settings ){
		settings = configSettings( settings );

		return super.index( search, settings );
	}

	//--- child generators 
	route( search, settings ){
		settings = configSettings( settings );

		return super.route( search, settings );
	}

	filter( search, settings ){
		settings = configSettings( settings );

		return super.filter( search, settings );
	}

	search( settings ){
		return this.select( settings );
	}

	select( settings ){
		settings = configSettings( settings );

		return super.select( settings );
	}
}

Proxied.settings = defaultSettings;

module.exports = Proxied;
