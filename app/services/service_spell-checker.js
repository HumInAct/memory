"use strict";
var fs    = require('fs')
  , spell = require('spell')
  ;

var big   = fs.readFileSync('data/knowledge/big.json').toString();
var dict = spell();
dict.load({corpus: JSON.parse(big)});

var lucky_check = function(word) {
	var nWord = dict.lucky(word);
	if (nWord) return nWord;
	return word;
};

var suggest_check = function(word) {
	var suggestions = dict.suggest(word);
	console.log(suggestions);
	return suggestions;
};

/*Module exports*/
module.exports.check = lucky_check;