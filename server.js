"use strict";
// /server.js
// starting point for Server


// Set up express
var express = require('express');


// Create the app and configure it
var server = express();
require('./config/settings')(server, express);


// Handler for internal server errors
require('./config/error')(server);


// Start server
server.listen(server.get('port'));
console.log("SERVER> listening on port " + server.get('port') + "...");


// get main controller
var App = require('./app/app.js');

// load the routes to the controller
require('./config/routes')(server, App);