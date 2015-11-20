"use strict";
var checker = require('../factories/factory_data.js')
  //, StringScanner = require("StringScanner")
  ;

/*
  analyses a clause using knowledge to
  make its english synthax meaningful
  (i'm Moroccan -> my country is Morocco)
*/
var analyze = function(clause) {
	var nodeA = clause[0],
		relation = clause[1],
		nodeB = clause[2];

	switch(relation) {
		case "be":
			if (nodeA.match(/^(\$|[A-Z])[^:]+$/)) {//node A is an actor
				
				if (nodeB.match(/^[A-Z][^:]+$/)) {//node B is a proper noun
					var res = checker.check_nnp(nodeB);
					nodeA = nodeA+":"+res.type;
					nodeB = res.value;
				}
				else if (nodeB.match(/^[0-9]+$/)) {//node B is a number
					nodeA = nodeA+":age";
				}
				else if (nodeB.match(/^=(fe)?males?$/)) {//node B is a gender
					nodeA = nodeA+":gender";
					nodeB = nodeB.substr(1);//make the state a name
				}

				return [nodeA, relation, nodeB];
			}
			break;
	}

	return clause;
};

/*MODULE EXPORTS*/
module.exports.analyze = analyze;