"use strict";
// /app/controller.js

var Node = require('./models/model_node')
  , Relation = require('./models/model_relation')
  ;


/*info text parse + processing*/
var parse_info = function(text, services) {
	var time = new Date();
	console.log(">"+ time.getHours() + ":"+time.getMinutes()+":"+time.getSeconds() + " request: [INFO] " + text);
	
	var sentences = services.get_sentences(text);//get sentences

	for(var i in sentences) {
		if (sentences[i].match(/\?$/)) { continue; }//pass a question query

		var tokens = services.get_tokens(sentences[i]);//get tokens words

		var taggedWords = services.get_taggedWords(tokens);//get POS tagged words

		var taggedStems = services.get_stems(taggedWords);//get morphed stems

		var data = services.get_clauses(taggedStems);//get action clauses
		// returns array of 3-value arrays [[nodeA, relation, nodeB]...]

		//save data on memory
		var relations = [];
		for(var i in data) {
			//this: data[i][0]; do: data[i][1]; that: data[i][2]
			relations.push(new Relation(0, data[i][1], new Node(data[i][0]), new Node(data[i][2])));
		}
	}

	return relations;
};

/*quesion query parse + processing*/
var parse_query = function(query, services) {
	var time = new Date();
	console.log(">"+ time.getHours() + ":"+time.getMinutes()+":"+time.getSeconds() + " request: [QUESTION] " + query);

	var parsedText = [], parsedQueries = [];
	
	var sentences = services.get_sentences(query);//get sentences

	for(var i in sentences) {
		if (sentences[i].match(/[^?]$/)) { info_parse(sentences[i]); continue; }//parse an info sentence

		var tokens = services.get_tokens(sentences[i]);//get tokens words

		var taggedWords = services.get_taggedWords(tokens);//get POS tagged words
		parsedText.push(tag_preview(taggedWords));//save tagged query in html format
		var taggedStems = services.get_stems(taggedWords);//get morphed stems

		var parsed = services.classify(taggedWords);//parse query
		parsedQueries.push(parsed);

		console.log("-query: " + parsed);
	}

	return 	parsedText.join("<br/>") +
			"<br/><i>Query: " + parsedQueries.join("/") + "</i>";
};

/*returns Html format or tokens and their POS tags*/
var tag_preview = function(taggedWords) {
	var parsedText = "";

	for (var i in taggedWords)
	    //word: taggedWords[i][0]
	    //tag: taggedWords[i][1]
	    parsedText += "<b>" + taggedWords[i][0] + "</b>(" + taggedWords[i][1] + ") ";

	return parsedText.trim();
}

// Module Exports
module.exports.parseQ = parse_query;
module.exports.parseI = parse_info;