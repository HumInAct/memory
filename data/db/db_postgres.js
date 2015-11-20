/*
Connection permissions:
SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER, CREATE, CONNECT, TEMPORARY, EXECUTE, and USAGE.
*/
var pg = require('pg');
var config = {//Heroku test db
    port: 5432
  , host: 'ec2-54-197-238-239.compute-1.amazonaws.com'
  , user: 'jozuysjivxvqsx'
  , password: '8322jON53O_P8ry0F3d4z2_Jfo' 
  , database: 'd9r7bsquacevas'
  , ssl: true
};
var HEROKU_DATABASE_URL = "postgres://eefclftacqnycs:l9U98hRDQCQf2bloGYPrIWvQxI@ec2-54-197-237-231.compute-1.amazonaws.com:5432/d5gcbv979p5btc"
  , APPFOG_DATABASE_URL = "postgres://rohwttki:Z0hfZ7s4Ei9hmUvyd_qrhAMcU4h8ZhgN@horton.elephantsql.com:5432/rohwttki"
  ;

/*PG Defaults settings*/
pg.defaults.poolSize = 20;//max nbr of clients in pool (10 clients)
pg.defaults.poolIdleTimeout = 5000;//time for idle client to exit pool (30000 ms)
pg.defaults.reapIntervalMillis = 2000;//frequency to check for idle clients (1000 ms)

/*Execute query with results and return them
* Result object structure:
command: The sql command that was executed (e.g. "SELECT", "UPDATE", etc.)
rowCount: The number of rows affected by the SQL statement (more information)
oid: The oid returned
rows: An array of rows (if the addRow command is used)
*/
var qRun = function(query, callback) {
	pg.connect(config, function(err, client, done) {
		if (err) { console.log("client.connect> "+err); client.end(); if (callback) callback(); }

		client.query(query, function(err, result) {
				if (err) { console.log("client.query> "+err); client.end(); if (callback) callback(); }
				
				switch(result.command) {
					case "SELECT":
						if (result.rows.length > 0)//log
							for (var row in result.rows) {
								console.log(JSON.stringify(result.rows[row]));
							}
						else console.log("query returned no result");
						break;
					default:
						console.log("query executed");
						break;
				}

				done();
				if (callback) callback(result.rows);
			});
		
		//client.on('drain', client.end.bind(client));//client disconnect when query queue is emptied
	});
};

/*Execute a single query instantly on a new client, without result*/
var qExecute = function(query, callback) {
	var client = new pg.Client(config);

	client.connect(function(err) {
		if (err) { console.log("client.connect> "+err); client.end(); return; }
		
		var q = client.query(query);

		q.on('error', function(err) {
			console.log("client.query> "+err);
			client.end();
			return;
		});

		q.on('end', function(result) {
			console.log("query executed");
			client.end();
			if (callback) callback();
		})
	});
}

/*Terminate all open connections and dispose of all clients in pool*/
var close = function() {
	pg.end();
}

/*INSERT Query function*/
var qInsert = function(table, values) {
	qRun('INSERT INTO '+table+' VALUES('+values.join(',')+')');
}

/*DELETE Query function
* if column is not given, all values
* in table are deleted
*/
var qDelete = function(table, column, value) {
	qRun('DELETE FROM '+table
		+ (column?' WHERE '+column+" = '"+value+"'":"") );
}

/* INIT DATABASE SCHEMA
*  creates table Friend
*  run only at first time
*/
var init = function() {
	qExecute('CREATE TABLE FRIEND ('+
		'username text PRIMARY KEY,'+
		'email text,'+
		'password text,'+
		'registered timestamp DEFAULT NOW()'+
		')',
	function() {
		qInsert("FRIEND(username,email,password)", ["'admin'", "'admin'", "'admin'"])
	});
};

//init();
//qRun("SELECT * FROM FRIEND");
//qRun("DROP TABLE FRIEND");


/*Module exports*/
module.exports.run = qRun;
module.exports.close = close;
module.exports.insert = qInsert;
module.exports.delete = qDelete;