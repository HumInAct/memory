"use strict";
// /config/auth/database.js

var mongoose = require('mongoose');

module.exports = function(uri) {

	// mongoose connection options
	var options = {
		db: { native_parser: true },
		server: { poolSize: 5 }
	};

	// create mongoose connection to user database
	var conn = mongoose.createConnection(uri, options);
    mongoose.set('user', conn);

	// CONNECTION EVENTS
	// When successfully connected
	conn.on('connected', function () {
	  console.log('DB> Mongoose "user" connection open to ' + uri);
	});

	// If the connection throws an error
	conn.on('error',function (err) {
	  console.log('DB> Mongoose "user" connection error: ' + err);
	});

	// When the connection is disconnected
	conn.on('disconnected', function () {
	  console.log('DB> Mongoose "user" connection disconnected');
	});

}