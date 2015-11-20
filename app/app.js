"use strict";
// /app/app.js

//contolers import
var swig = require('swig')
  , modelFactory = require('./factories/factory_model')
  , serviceFactory = require('./factories/factory_service')
  , ctrl = require('./controller')
  ;


// App object
function App() {
	//this.factory = {};// object map of factories by session ids
}

/*
	result: {
		init: "", // start or resume session
		message: "", // hia first message tip
		[memory: ""] // html memory preview, if session resume
	}
*/
App.prototype.initialize = function(req, res) {
	var sessionID = req.session.id;
	var result = {};

	if (!req.session.init) {// session start
		req.session.init = true;
		// use session store for data
		req.session.relations = [];

		console.log('API>['+sessionID+'] session initialized');
		result.init = "start";
		result.message = "Hi! Tell me something<br/>about yourself";
	}
	else {// session resume
		if (req.user) {// user logged in
			console.log("user logged in!!");
		}

		console.log('API>['+sessionID+'] session resumed');
		console.log(req.session.relations);

		result.init = "resume";
		result.message = "Welcome back! :)";

		var tmpl = swig.compileFile("views/relations.html");
		result.memory = tmpl({"relations": req.session.relations});
	}
	res.json(result);
}

App.prototype.getRelations = function(req, res) {
	console.log('API>['+req.sessionID+'] GET relations');
	var relations = req.session.relations;
	console.log(relations);

	if (relations.length > 0)
		res.render("relations", {locals: {"relations": relations } });
	else res.end('No object learned...');
};

/*
	result: {
		raw: "request.text",
		answer: "",
		html: "",
		relations: [{}, {}]
	}
*/
App.prototype.postRelation = function(req, res) {
	if (!req.body.text) throw new Error('No property: text!');

	var result = { raw: req.body.text };
	console.log('API>['+req.sessionID+'] POST new relation: '+result.raw);

	// create a relation, information comes from AJAX request
	if (result.raw.match("[^?]$")) { // info type
		if (req.session.relations.length < 10 || req.user) {// 10 relations for anonym session, unlimited for logged in user
			result.relations = ctrl.parseI(result.raw, serviceFactory);
			result.answer = "Got it";
			var found;
			for (var i in result.relations) {//session data commit
				found = false;
				for(var j in req.session.relations) {
					if (modelFactory.relationCmp(result.relations[i], req.session.relations[j]) === true)
						found = true;
				}
				if (found === true) continue;
				result.relations[i].id = req.session.relations.length;
				req.session.relations.push(result.relations[i]);
				if (req.session.relations.length >= 10) break;
			}
		}
		else if (req.session.relations.length >= 10) {// only 10 relations saved for visitor session
			result.full = true;
			result.answer = "Hey, why don't we<br/>become friends?!"
		}

		var tmpl = swig.compileFile("views/relations.html");
		result.html = tmpl({"relations": result.relations});
	}
	else { // question type
		result.answer = "I don't know yet";
		result.html = ctrl.parseQ(result.raw, serviceFactory);
	}

	res.json(result);
};

/* Delete all relations from memory */
App.prototype.deleteRelations = function(req, res) {
	console.log('API>['+req.sessionID+'] DELETE all relations');

	req.session.relations = [];

	res.json({"ok":true});
};

/* Delete one or many relations from memory */
App.prototype.deleteRelation = function(req, res) {
	var id = req.params.id
	  , n  = req.params.n;
	console.log('API>['+req.sessionID+'] DELETE '+ n +' relation(s) from '+id);

	req.session.relations.splice(id,n);

	res.json({"ok":true});
};


module.exports = new App();