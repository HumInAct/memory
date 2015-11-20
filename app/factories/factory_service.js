"use strict";
// /app/factories/factory_service.js

// Service imports
var sentTokenizer = require('../services/service_sent-tokenizer.js')
  , tokenizer = require('../services/service_tokenizer.js')
  , morpher = require('../services/service_morpher.js')
  , posTagger = require('../services/service_postagger.js')
  , chunker = require('../services/service_chunker.js')
  , parser = require('../services/service_chunk-parser.js')
  , spellChecker = require('../services/service_spell-checker.js')
  , classifier = require('../services/service_classifier.js')
  , synFinder = require('../services/service_syn-finder.js')
  , analyzer = require('../services/service_analyzer.js')
  ;

var generate_sentences = function(text) {
	//Sentence Tokenizing
	var sentences = sentTokenizer.tokenize(text);//sentence tokens
	//console.log("-sentences: " + sentences.join("//"));

	//Synonym patterns find
	for(var i in sentences)
		sentences[i] = synFinder.get_synonym(sentences[i]);
	//console.log("-synonyms: " + sentences.join("//"));

	return sentences;
}

var generate_tokens = function(text) {
	//Tokenizing
	var tokens = tokenizer.tokenize(text);//word tokens
	console.log("-tokens: " + tokens.join("|"));
	
	//Spell-checking (on non proper nouns)
	for(var i in tokens) {
		if (tokens[i].match(/^[a-z]+$/))
			tokens[i] = spellChecker.check(tokens[i]);
	}
	//console.log("-spell-check: " + tokens.join("|"));

	return tokens;
}

var generate_postags = function(tokens) {
	//POS Tagging
	var taggedWords = posTagger.parse(tokens);
	//console.log("-pos-tags: " + taggedWords.join('/'));

	return taggedWords;
};

var generate_stems = function(taggedWords) {
	//var newText = "";
	var word, tag;
	
	//morph words to their stems/lemmas/inflections/value
	for (var i in taggedWords) {
	    word = taggedWords[i][0];
	    tag = taggedWords[i][1];

	    if (/^(PRP|VB[^P]?|NN[^P]{1})$/.test(tag)) {//stem nouns, pronouns and verbs, except proper nouns (NNP)
		    switch(tag) {
		    	case "PRP":
		    		word = morpher.stem(word.toLowerCase());//(I -> me)
		    		break;

		    	case "RB":
			    	if (/\'/.test(word))//(n't -> not)
						word = morpher.expand(word);
					break;

		    	case "VB":
			    	if (/\'/.test(word))//('m -> am)
						word = morpher.expand(word);
					if (/^(is|are|am)$/.test(word))//to be verb
						word = morpher.stem(word);
		    		break;

		    	case "VBZ":
			    	if (/\'/.test(word))//('m -> am)
						word = morpher.expand(word);
		    	case "NNS":
					word = morpher.inflect(word, tag);
		    		break;
		    		
		    	default://VBG VBN VBD
					word = morpher.stem(word);
		    		break;
		    }
	    	taggedWords[i][0] = word.toLowerCase();
		}
		else if ( (tag === "CD" && !word.match(/^[0-9]/)) || (tag === "NN" && word.match(/[-]/)) ) {//get cardinal value of number nouns
			word = morpher.noun_value(word);

	    	taggedWords[i][0] = word;//Word
	    	if (/[0-9]/.test(word)) taggedWords[i][1] = "CD";//Tag CD if there was a number value conversion
		}
	}
	//console.log("-stems: " + taggedWords.join('/'));

	return taggedWords;
};

var generate_clauses = function(taggedWords) {
	//generate chunks of nouns/verbs from tags
	var phrases = chunker.get_phrases(taggedWords);

	//generate clauses of actions/relations from chunks
	var data = parser.parse(phrases);
	var clauses = parser.process(data);
	//analyze clauses to get english meaning
	for(var i in clauses) clauses[i] = analyzer.analyze(clauses[i]);
	console.log("-clauses: " + clauses.join('; '));

	return clauses;
}

var classify = function(taggedWords) {
	var query = classifier.classify(taggedWords);

	return JSON.stringify(query);
}


/*MODULE EXPORTS*/
module.exports.get_sentences = generate_sentences;
module.exports.get_tokens = generate_tokens;
module.exports.get_taggedWords = generate_postags;
module.exports.get_stems = generate_stems;
module.exports.get_clauses = generate_clauses;
module.exports.classify = classify;