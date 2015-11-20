"use strict";
// /app/models/model_relation.js

/*
* A Relation can be between
* two Nodes, with a list of properties
* one Node is the subject and one is the object
* the properties contain the other information
*/

function Relation(id, name, nodeA, nodeB) {
	this.id = id;
	if (nodeA) this.nodeA = nodeA;//(this)
	this.name = name;//(do)
	if (nodeB) this.nodeB = nodeB;//(that)
	this.properties = {};//(this way)
}

Relation.prototype.set = function(key, value) {
	this.properties[key] = value;
};

Relation.prototype.getOwner = function(){};
Relation.prototype.getAction = function(){};
Relation.prototype.getState = function(){};


module.exports = Relation;