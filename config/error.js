"use strict";
// /config/error.js
// Handler for internal server errors

var props = require('./properties');

module.exports = function(server) {
	
	function errorHandler(err, req, res, next) {
		console.error(err.message);
		console.error(err.stack);
		res.status(500);
		
		if (props['ENV'] === 'dev')// show error stack if on dev environment
			res.render('error', {layout:false, locals: {message: err.message, stack: err.stack}});
		else res.render('error', {layout:false, locals: {message: err.message}});
	}
	
	server.use(errorHandler);
};