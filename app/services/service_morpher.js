"use strict";
var natural = require('natural')
  , checker = require('../factories/factory_data.js')
  ;

/*Change the form of contracted verbs to full (I'm->I am)*/
var contraction_expand = function(token) {
	var expToken = token;

	switch(token) {
		case "'s":
			expToken = "is";
			break;
		case "'m":
			expToken = "am";
			break;
		case "n't":
			expToken = "not";
			break;
		case "'ll":
			expToken = "will";
			break;
		case "'d":
			expToken = "would";
			break;
		case "'re":
			expToken = "are";
			break;
		case "'ve":
			expToken = "have";
			break;
	}

	return expToken;
};

/*Returns lemma or root of token (waking->wake)*/
var porter_stem = function(token) {
	if (/^(is|are|am)$/.test(token)) {//verb to be
		return "be";
	}
	else if (/^(i|he|she|we|they|myself|yourself)$/.test(token)) {//prp: I -> me
		switch(token) {
			case "i": case "myself": return "me";
			case "yourself": return "you";
			case "he": return "him";
			case "she": return "her";
			case "we": return "us";
			case "they": return "them";
		}
	}
	else if (token === "using")
		return "use";
	else//other verbs and nouns
		return natural.PorterStemmer.stem(token);
};

/*Pluzalize verb or Singularize noun (kids->kid)*/
var inflect = function(token, tag) {
	if (typeof tag === "undefined") tag = "NNS";

	switch(tag) {
		case "VBZ"://VBZ -> VB
			//Exceptions
			if (/^(is)$/.test(token)) {//verb to be
				return "be";
			}
			else if (/^(has)$/.test(token)) {//verb to have
				return "have";
			}
			var verbInflector = new natural.PresentVerbInflector();
			return verbInflector.pluralize(token);

		case "NNS"://NNS -> NN
			//Exceptions
			if (token === "pies")
				return "pie";
			/*else if (token === "flies")
				return "fly";*/
			else {
				var nounInflector = new natural.NounInflector();
				return nounInflector.singularize(token);
			}

		default:
			return token;
	}
};

/*Returns the noun form of an adjectif 'w'*/
var adj_to_noun = function(w) {
	var irregulars = {
	  "clean": "cleanliness",
	  "naivety": "naivety"
	};

	if (!w) 				return "";
	if (irregulars[w])		return irregulars[w];
	if (w.match(" "))		return w;
	if (w.match(/w$/)) 		return w;
	if (w.match(/y$/)) 		return w.replace(/y$/, 'iness');
	if (w.match(/le$/)) 	return w.replace(/le$/, 'ility');
	if (w.match(/ial$/)) 	return w.replace(/ial$/, 'y');
	if (w.match(/al$/)) 	return w.replace(/al$/, 'ality');
	if (w.match(/ting$/)) 	return w.replace(/ting$/, 'ting');
	if (w.match(/ring$/)) 	return w.replace(/ring$/, 'ring');
	if (w.match(/bing$/)) 	return w.replace(/bing$/, 'bingness');
	if (w.match(/ning$/)) 	return w.replace(/ning$/, 'ningness');
	if (w.match(/sing$/)) 	return w.replace(/sing$/, 'se');
	if (w.match(/ing$/)) 	return w.replace(/ing$/, 'ment');
	if (w.match(/ess$/)) 	return w.replace(/ess$/, 'essness');
	if (w.match(/ous$/)) 	return w.replace(/ous$/, 'ousness');
	if (w.match(/s$/)) 		return w;

	return w + "ness";
};

/*Returns the integer value of a number noun*/
var nn_to_cd = function(w) {
	var value = checker.check_cd(w);

	if (typeof value === "object") {//twenty-one-years -> 21 years
		var sum = 0, words = "";
		for(var n in value.numbers)
			sum += value.numbers[n];
		for (var nn in value.notNumbers)
			words += value.notNumbers[nn] + " ";

		return sum + (words.length>0 ? " "+words.trim() : "");
	}
	else if (typeof value === "number") {//twenty -> 20
		return value;
	}
	else return w;
};


/*MODULE EXPORTS*/
module.exports.expand = contraction_expand;
module.exports.stem = porter_stem;
module.exports.inflect = inflect;
module.exports.noun_form = adj_to_noun;
module.exports.noun_value = nn_to_cd;