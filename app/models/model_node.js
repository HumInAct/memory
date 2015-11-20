"use strict";
// /app/models/model_node.js


function Node(name) {
	this.name = name;
}

Node.prototype.getOwner = function(){};
Node.prototype.getObject = function(){};
Node.prototype.getValue = function(){};
Node.prototype.getState = function(){};


module.exports = Node;