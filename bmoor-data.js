module.exports = {
	Feed: require('./src/Feed.js'),
	Pool: require('./src/Pool.js'),
	Collection: require('./src/Collection.js'),
	collection: {
		Proxied: require('./src/collection/Proxied.js')
	},
	stream: {
		Converter: require('./src/stream/Converter.js')
	},
	object: {
		Proxy: require('./src/object/Proxy.js'),
		Test: require('./src/object/Test.js'),
		Hash: require('./src/object/Hash.js')
	},
	structure: {
		Model: require('./src/structure/Model.js').default,
		Schema: require('./src/structure/Schema.js').default
	}
};
