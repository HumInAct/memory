var MongoClient = require('mongodb').MongoClient
  , Server = require('mongodb').Server
  ;

module.exports = function(host, database) {

	var mongoclient = new MongoClient(new Server(host, 27017, { 'native_parser': true}));
	var db = mongoclient.db(database);

	mongoclient.open(function(err, mongoclient) {
		if (err) throw err;

		db.collection('coll').findOne({}, function(err, doc) {
			console.log(doc);
		});

		return {
			insert: "",
			delete: "",
			find: ""
		}
	});

};