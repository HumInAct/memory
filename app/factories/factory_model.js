"use strict";
// /app/factories/factory_model.js

// Models
var Node = require("../models/model_node.js")
  , Relation = require("../models/model_relation.js")
  ;

// Model Factory object
function Factory() {
}

/*********************************NODE***************************************/

// nodes equality operator
Factory.prototype.nodeCmp = function(node1, node2) {
	if (typeof node1 === "undefined" || typeof node2 === "undefined")
		return (typeof node1 === "undefined" && typeof node2 === "undefined");

	if (node1.name === node2.name)
		return true;

	return false;
};

/*******************************RELATION*************************************/

// relations equality operator
Factory.prototype.relationCmp = function(rel1, rel2) {
	if (typeof rel1 === "undefined" || typeof rel2 === "undefined")
		return (typeof rel1 === "undefined" && typeof rel2 === "undefined");
	
	if (rel1.name === rel2.name
		&& this.nodeCmp(rel1.nodeA, rel2.nodeA)
		&& this.nodeCmp(rel1.nodeB, rel2.nodeB)
		&& rel1.properties === rel2.properties
		)
		return true;

	return false;
}

/****************************************************************************/

module.exports = new Factory();