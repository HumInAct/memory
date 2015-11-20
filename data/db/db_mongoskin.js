/*MODULE IMPORTS*/
var mongo = require('mongoskin');

// Database connect
var user = "hia"
  , pwd = "$hia:password"
  , host = "ds039487.mongolab.com:39487"
  , db = mongo.db('mongodb://'+user+':'+pwd+'@'+host+'?auto_reconnect',//+user+':'+pwd+'@'
				{
				  database: 'testdb',
				  safe: true
				})
  ;

// Ping the server
db.admin.ping(function(err, pingResult) {
	if (pingResult) console.log("Connected to database");
	else console.log("Couldn't connect to database!");
});

// Get the Collections
var testCol = db.collection('test');
var logCol = db.collection('logs');
var nodeCol = db.collection('nodes');
var relCol = db.collection('relations');

/*MODULE EXPORTS*/
module.exports.testCol = testCol;
module.exports.logCol = logCol;
module.exports.nodeCol = nodeCol;
module.exports.relCol = relCol;