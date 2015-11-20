"use strict";

/*
  Returns the owner actor
  depending on the passed token
  of a PRP or PRP$ tagged word
*/
var get_owner = function(token) {
	switch(token.toLowerCase()) {
		case "my": case "me": case "myself": case "mine":
			return "$user";
		case "your": case "you": case "yourself": case "yours":
			return "$hia";
		default:
			return "$other";
	}
}

/*
  Returns the parsed name
  of an NP chunk
*/
var get_node_name = function(chunkTokens) {
	var node = new Object();
	var token, tag;

	for(var tok in chunkTokens) {
		token = chunkTokens[tok][0];
		tag = chunkTokens[tok][1];

		switch(tag) {
			case "PRP$": case "PRP"://possessive and personal pronoun is owner
				node['owner'] = get_owner(token);
				break;
			case "NN": case "NNS"://nouns are the node
				if (node['name']) node['name'] += ":"+token;//sequential nouns are concatenated
				else node['name'] = token;
				break;
			case "JJ": case "JJS"://adjectives are labels for the node
				if (node['state']) node['state'] += ","+token;
				else node['state'] = token;
				break;
			case "NNP": case "NNPS": case "CD"://values: proper nouns and cardinal numbers
				if (node['value']) node['value'] += " "+token;
				else node['value'] = token;
				break;
			case "POS"://'s possessive: make precedent noun or value the owner
				if (!node['owner']) {
					if (node['value']) { node['owner'] = node['value']; node['value'] = null; }
					else if (node['name']) { node['owner'] = node['name']; node['name'] = null; }
				}
				break;
			default:
				node['name'] = token;
				break;
		}
	}
	var tmp = (node['name']?node['name'] + (node['value']?":"+node['value']:""):(node['value']?node['value']:""));
	var nodeName = (node['owner']?node['owner']+(tmp?":"+tmp:""):tmp) + 
					(node['state']?"="+node['state']:"");

	return nodeName;
}

/*
  Returns a 3 value array from the tagged tokens
*/
var parse = function(chunks) {
	var buffer = new Array();//nodes/relations buffer
	var chunk, token, tag;//tmp vars

	//Parse chunks
	for(var i in chunks) {
		chunk = chunks[i];
		console.log(chunk);

		switch(chunk.tag) {
			case "NP": 									// Noun phrase
				var nodeName = get_node_name(chunk.taggedTokens);
				buffer.push(["node", nodeName]);
				//console.log("node: "+node_name);
				break;
			case "VP": 									// Verb phrase
				var relation = new Object();

				for(var tok in chunk.taggedTokens) {
					token = chunk.taggedTokens[tok][0];
					tag = chunk.taggedTokens[tok][1];

					switch(tag) {
						case "VBG"://continuous verb can be relation or action
							if (tok > 0 && relation['name'])//if is second continuous verb
								relation['action'] = relation['name'];//make the first action
							relation['name'] = token;//and make it the relation
							break;
						case "RB": case "RBR": case "RBS": case "RP": //adverbs are labels for the relation
							if (relation['state']) relation['state'] += ","+token;
							else relation['state'] = token;
							break;
						case "VB": case "VBZ": case "VBD": case "VBN": case "VBP"://verb is the relation
						default:
							if (relation['name']) relation['name'] += " "+token;
							else relation['name'] = token;
							break;
					}
				}
				var relName = (relation['action']?"/"+relation['action']+":":"") + relation['name'] + 
								(relation['state']?"="+relation['state']:"");
				buffer.push(["relation", relName]);
				//console.log("relation: "+rel_name);
				break;
			case "PP": 									// Prepositional Phrase
				var tokenIN = chunk.taggedTokens.shift()[0];
				var previous = buffer.slice(-1)[0];

				if (previous[0] === "node") {//PP after a node
					switch(tokenIN) {
						case "of": case "for": case "to"://possession
							var nodeName = get_node_name(chunk.taggedTokens);
							previous[1] = nodeName + ":" + previous[1];//add owner to node
							break;
						default:
							break;
					}
				}
				else {//PP after a relation
					var prevRelName = previous[1];
				}
				break;
			case "FRAG": 								// Fragment
				break;
		}
	}

	return buffer;
};


/*Returns the priority of a chunk based on its tag and relation type*/
var get_priority = function(relation_name, node_name) {
	switch(relation_name) {
		case "be":
			if ( node_name.match(/^\$[^:]+$/) )//"PRP":
				return 1;
			if ( node_name.match(/^\$[^:]+[:]/) )//"PRP$":
				return 2;
			if ( node_name.match(/^[A-Z]/) )//"NNP":
				return 3;
			if ( node_name.match(/^[a-z]+/) )//"NN":
				return 4;
			if ( node_name.match(/[0-9]+/) )//"CD":
				return 5;
			if ( node_name.match(/\=.+/) )//"JJ":
				return 6;
			return 10;
			break;
		default:
			return 1;
			break;
	}
}

// returns array of 3-value array (nodeA, relation, nodeB)
var process = function(buffer) {
	var n1, n2, r;
	var clauses = new Array();//clauses to return

	while(buffer.length > 0) {
		switch(buffer[0][0]) {//element type
			case "node":
				if (!n1) n1 = buffer.shift()[1];
				else n2 = buffer.shift()[1];
				break;
			case "relation":
				r = buffer.shift()[1];
				break;
		}

		if (n1 && n2 && (r || buffer.length === 0)) {
			//make relation be if no relation
			if (buffer.length === 0 && !r) r = "be";
			//calculate priority of nodes
			var p1 = get_priority(r, n1);
			var p2 = get_priority(r, n2);
			if (p1 <= p2) clauses.push([n1, r, n2]);
			else clauses.push([n2, r, n1]);
			n1 = r = null;//clear node and relation, save last node
		}
	}

	return clauses;
}


/*MODULE EXPORTS*/
module.exports.parse = parse;
module.exports.process = process;