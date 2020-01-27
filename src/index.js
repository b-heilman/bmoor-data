
// I'm not going to keep indexing everything this way.  It goes back to when I used to
// webpack everything.  I'll leave it to people to build their own index, so they don't need
// to pull everything in.  New methods won't be added to this.
module.exports = {
	collection: require('./collection/index.js'),
	object: require('./object/index.js'),
	Actionable: require('./Actionable.js').Actionable,
	Collection: require('./Collection.js').Collection,
	Feed: require('./Feed.js').Feed,
	Subject: require('./Subject.js').Subject
};
