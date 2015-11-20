"use strict";

/*the default string to be processed*/
var patterns = {
	me: 	"me",
	my_name: 		"my name is $1",
	your_name: 		"your name is $1",

	my_age: 	"my age is $1",
	your_age: 	"your age is $1",

	my_country: 	"my country is ",
	your_country: 	"your country is ",

	think: 		"I think that $1"
};

/*regular expressions of variables to include*/
var vars = {
	name: "([A-Z][A-Za-z]+(?: *[A-Z][A-Za-z]+)*)",//Said El Imam
	age: "([0-9]+)"//23
}

/*Synonyms to look for at input*/
var synonyms = [
	["yours truly", 	"me"],
	["i(?: am|'m| was) (?:nam|call)ed "+vars['name']+"(?:[.!,]|$)"	,	"my_name"],
	["this is "+vars['name']+"(?:[.!,]|$)"							,	"my_name"],
	["you(?: a|')re (?:nam|call)ed "+vars['name']+"(?:[.!,]|$)"		,	"your_name"],

	["i(?: a|')m "+vars['age']+" ?(?:years? old|y ?o|years?)?(?:[.!,]|$)"	,		"my_age"],
	["you(?: a|')re "+vars['age']+" ?(?:years? old|y ?o|years?)?(?:[.!,]|$)"	,	"your_age"],

	["^i(?: a|')m from ",				"my_country"],
	["^you(?: a|')re from ",			"your_country"],

	["i (?:guess|believe(?! in))(?! that) (.+ .+)",		"think"],
	["maybe (.+ .+)",									"think"]
];

/*Synonym finder*/
var get_synonym = function(text) {
	var tmp_text = text.substr(0,1).toLowerCase() + text.substr(1);
	for(var i in synonyms) {
		if (tmp_text.match(synonyms[i][0])) {
			//console.log("synonym-pattern: " + text + " -> " + patterns[synonyms[i][1]]);
			return tmp_text.replace(new RegExp(synonyms[i][0]), patterns[synonyms[i][1]]);
		}
	}
	return text;
}

/*TESTS/
console.log(get_synonym("i am Said El Imam"));
console.log(get_synonym("i'm 16 years old"));
console.log(get_synonym("i was named Said"));
console.log(get_synonym("i'm named Soufiane"));
console.log(get_synonym("this is Jack RED"));*/

/*MODULE EXPORTS*/
module.exports.get_synonym = get_synonym;