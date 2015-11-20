"use strict";
// config/routes.js

var props = require('./properties')
  , swig = require('swig')
  , menuTmpl = swig.compileFile("views/menubar.html")
  ;


module.exports = function(server, app) {

	// APPLICATION -----------------------------------------------------

	server.get('/app/ping', function(req, res) { res.send('pong', 200); });// ping request
	server.get('/app/init', function(req,res) { app.initialize(req,res); });// Init app session


	// API -------------------------------------------------------------
	
	server.get('/api/relations', function(req,res) {app.getRelations(req,res);});// get all relations
	server.post('/api/relations', function(req,res) {app.postRelation(req,res);});// create relation and send it back
	server.delete('/api/relations', function(req,res) {app.deleteRelations(req,res);});// delete all user relations
	server.delete('/api/relations/:id/:n', function(req,res) {app.deleteRelation(req,res);});// delete :n user relations starting from :id


	// APPLICATION -----------------------------------------------------

	// return a view to front-end to include as a partial element in page
	// Express gets the page name from /views folder
	server.get('/partials/:pagename', function(req, res) {
		var pagename = req.params.pagename;
		console.log('API>['+req.sessionID+'] GET page partial: '+pagename);
  		res.render(pagename);
	});

	// joker for remaining routes not defined above
	// loads the single view file (the page changes are handled on the front-end)
	server.get('*', function(req, res) {
		res.render('index.html', {env: props['ENV'], authenticated: (req.user?true:false) });
	});

};