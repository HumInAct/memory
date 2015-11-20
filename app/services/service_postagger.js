"use strict";
/* Part-of-Speech TAGGER

Penn Treebank Tags II
Word level

CC - Coordinating conjunction
CD - Cardinal number
DT - Determiner
EX - Existential there
FW - Foreign word
IN - Preposition or subordinating conjunction
JJ - Adjective
JJR - Adjective, comparative
JJS - Adjective, superlative
LS - List item marker
MD - Modal
NN - Noun, singular or mass
NNS - Noun, plural
NNP - Proper noun, singular
NNPS - Proper noun, plural
PDT - Predeterminer
POS - Possessive ending
PRP - Personal pronoun
PRP$ - Possessive pronoun (prolog version PRP-S)
RB - Adverb
RBR - Adverb, comparative
RBS - Adverb, superlative
RP - Particle
SYM - Symbol
TO - to
UH - Interjection
VB - Verb, base form
VBD - Verb, past tense
VBG - Verb, gerund or present participle
VBN - Verb, past participle
VBP - Verb, non-3rd person singular present
VBZ - Verb, 3rd person singular present
WDT - Wh-determiner
WP - Wh-pronoun
WP$ - Possessive wh-pronoun (prolog version WP-S)
WRB - Wh-adverb
*/
var glossary = require("glossary")({ collapse: false })
  ;


function POSTagger(lexicon){
    if (lexicon) this.lexicon = lexicon;
    else this.lexicon = require('../../data/knowledge/lexicon');
    
    this.doubleVerbs = [ "do", "does", "did",
	                    "let", "lets",
	                    "have", "has", "had",
	                    "make", "made",
	                    "see", "sees", "saw", "seen",
	                    "watch", "watches", "watched",
	                    "think", "thinks", "thought",
	                    "guess", "guesses"];
}

POSTagger.prototype.tag = function(words){
    var ret = new Array(words.length);
    for (var i = 0, size = words.length; i < size; i++) {
        var ss = this.lexicon[words[i]];
        // 1/22/2002 mod (from Lisp code): if not in hash, try lower case:
        if (!ss) 
            ss = this.lexicon[words[i].toLowerCase()];
        if (!ss && words[i].length == 1) 
            ret[i] = words[i] + "^";
        else if (!ss && words[i].match(/^[A-Z]/)) 
            ret[i] = "NNP";
        else if (!ss && words[i].match(/s$/)) 
            ret[i] = "NNS";
        else if (!ss) 
            ret[i] = "NN";
        else 
            ret[i] = ss[0];
    }
	
	/**
     * Apply transformational rules
     **/
    for (var i = 0; i < words.length; i++) {
        var word = ret[i];
        //EXCEPTIONS
        if (i > 0 && words[i] === "'s") {
            if (/^VBG$/.test(ret[i+1]) || /^W/.test(ret[i-1])) ret[i] = 'VBZ';//'s + VBG | W* + 's -> is
            else ret[i] = 'POS';//'s + NN -> POS
        }
        else if (i > 0 && words[i] === "'" && ret[i-1] === "NNS") {//NNS + ' -> POS
            ret[i] = 'POS';//'s + NN -> POS
        }
        else if (i > 0 && words[i].toLowerCase() == "like" && /^(PRP)$/.test(ret[i-1])) {//like:VB/IN
            ret[i] = "VB";
        }
        else if (words[i].toLowerCase() == "her" && (i === words.length-1 || !/^(NN|JJ)/.test(ret[i+1]))) {//her: PRP$->PRP
            ret[i] = "PRP";
        }
        else if (words[i].toLowerCase() == "that" && ret[i] == "IN") {//IN [+ NN] -> WDT (that)
            if ((i < words.length-1 && ret[i+1] == "NN") || i === words.length-1 || i === 0)
                ret[i] = "WDT";
        }
        // rule: A word starting with a capital letter in the middle of the sentence is a NNP (except one letter and UH tag Hello..)
        else if (i > 0 && /^[A-Z].+/.test(words[i]) && word !== "UH" ) {
            ret[i] = "NNP";
        }
        else {
            //PAST CORRECTIONS
            // rule: {VBZ|VB} + VB --> {NNS|NN} + VB (except verbs have and be)
            if (i > 0 && word.match(/^VB/) && ret[i-1].match(/^VBZ?$/)
                && !words[i-1].match(/^('.+|is|am|are|has|have)$/)) {
                if (ret[i-1] == "VB")
                    ret[i-1] = "NN";
                else ret[i-1] = "NNS";//VBZ
            }

            //ACTUAL CORRECTIONS
            // rule: {DT | JJ}, {VBD | VBP} --> DT|JJ, NN
            if (i > 0 && /^(DT$|JJ)/.test(ret[i - 1]) ) {
                if (word == "VBD" || word == "VBP" || word == "VB") {
                    ret[i] = "NN";
                }
            }

            // rule: {DT | VB}, {VBZ} --> DT|VB, NNS
            if (word == "VBZ" && ( i===0 || (i > 0  && /^(DT$|VB[^G])/.test(ret[i - 1])) ) ) {//(the plays)
                if ( ( ret[i-1] !== "DT" || (ret[i-1] === "DT" && words[i-1].match(/^the$/i))) && words[words.length-1] !== "?")
                    ret[i] = "NNS";
            }
            // rule: PRP$, {VBP | VB} --> NN
            if (word.match(/VBP?/) && i > 0  && /^(PRP\$)$/.test(ret[i - 1])) {//(my play)
                    ret[i] = "NN";
            }
            // rule: convert a noun to a plural noun if words[i] ends with "ses"
            else if (word.match(/^NN/) && words[i].match("ses$")) 
                ret[i] = "NNS";
            // rule: if a word has been categorized as a common noun and it ends with "s",
            //         then set its type to plural common noun (NNS)
            else if (word === "NN" && words[i].match("s$") && /[^ous]$/.test(words[i].toLowerCase())) 
                ret[i] = "NNS";

            // rule: convert a noun to a number or url (CD|URL) if "." appears in the word
            if (word.match("^N")) {
    			if (words[i].indexOf(".") > -1) {
                  // url if there are two contiguous alpha characters or more after the point
                  if (/\.[a-zA-Z]{2}/.test(words[i]))
                    ret[i] = "URL";
                  else if (/[0-9]*\.[0-9]+/.test(words[i]))
                    ret[i] = "CD";
                  else
                    ret[i] = "NN";
                }
    			// Attempt to convert into a number
                if (parseFloat(words[i]))
                    ret[i] = "CD";
            }

            // rule: convert any type to adverb if it ends in "ly" and more than 3 letters (!fly,reply);
            if (word.match(/^NN/) && words[i].length > 3 && words[i].match("ly$"))
                ret[i] = "RB";
            // rule: convert a common noun (NN or NNS) to an adjective if it ends with "al" and length > 3 (!pal)
            else if (word.match(/^NN/) && words[i].length > 3 && words[i].match("al$")) 
                ret[i] = "JJ";
            // rule: convert a noun to a past participle if words[i] ends with "ed" and length > 3 (!bed)
            else if (word.match(/^NN/) && words[i].length > 3 && words[i].match("ed$")) 
                ret[i] = "VBN";

            // rule: convert a noun to a verb if the preceding work is "would"
            else if (i > 0 && ret[i].match(/^NN/) && words[i - 1].toLowerCase() == "would") {
                if (ret[i] === "NNS")
                    ret[i] = "VBZ";
                else ret[i] = "VB";
            }
            // rule: TO + NN --> VB
            else if (i>0 && ret[i-1] === "TO" && ret[i] === "NN")
                ret[i] = "VB";
            // rule: convert a noun to a verb if the preceding work is a PRP with no verb before (except double verbs: made me do)
            else if (i > 0 && ret[i].match(/^NN/) && ret[i-1] == "PRP"
                && (!ret[i-2] || !ret[i-2].match(/^(VB|TO|IN)/) || words[i-2].match("^(that|"+this.doubleVerbs.join("|")+")$")) ) {
                if (ret[i] === "NNS")
                    ret[i] = "VBZ";
                else ret[i] = "VB";
            }

            // rule: convert a common noun to a present participle verb (i.e., a gerund)
            /*if (startsWith(ret[i], "NN") && words[i].match("ing$"))
                ret[i] = "VBG";*/
        }
    }

	var result = new Array();
	for (i in words) {
		result[i] = [words[i], ret[i]];
	}
    return result;
}


/*Parses a text into part of speech tags*/
var parse = function(tokens) {
	var taggedWords = (new POSTagger).tag(tokens);

	return taggedWords;
};

/*Extracts keywords from text*/
var keywords = function(text) {
	var keywords = glossary.extract(text);

	return keywords;
};

/*Module Exports*/
module.exports.parse = parse;
module.exports.keywords = keywords;