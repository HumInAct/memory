"use strict";

/*
  Removes unnecessary tokens from the chunk
*/
var chunk_stem = function(chunk) {
	if (chunk.taggedTokens.length > 1)
		switch(chunk.tag) {
			case "NP":
				if (chunk.taggedTokens[0][1] === "DT")
					chunk.taggedTokens.shift();
				break;
			case "VP":
				if (chunk.taggedTokens[0][0] === "be" && chunk.taggedTokens[1][1] !== "VBN")
					chunk.taggedTokens.shift();
				break;
			case "PP":
				if (chunk.taggedTokens.length > 2 && chunk.taggedTokens[1][1] === "DT") {
					var tmp = chunk.taggedTokens.shift();
					chunk.taggedTokens.shift();
					chunk.taggedTokens.unshift(tmp);
				}
				break;
		}

	return chunk;
}

/*
  Collapse tagged words into chunks of nouns or verbs
*/
var get_chunks = function(taggedWords) {
	var chunks = new Array(), chunk;
	var word, tag;
	var oldWTag = "",//preceding word tag
		oldCTag = "";//preceding chunk tag

	for(var i in taggedWords) {
	    word = taggedWords[i][0];
	    tag = taggedWords[i][1];

	    if (tag.match(/^(NN|J|W?DT$|PRP|CD$|POS)/)) {		// Noun Phrase (determinants, nouns, proper nouns and pronouns)
	    	//concatenated to prepositional phrase if available and noun phrase
	    	if (oldCTag !== "PP" && (oldCTag !== "NP"
	    	//Proper nouns, Determinants, Cardinals and Prepositions only at beginning
	    	//Except if next to the same tag
	    		|| ( tag.match(/(DT$|PRP|NNP$|CD$)/) && !oldWTag.match("^"+tag+"$") )
	    		)) {

	    		if (chunk) { chunk_stem(chunk); chunks.push(chunk); }
	    		chunk = {tag: "NP", taggedTokens: []};
	    	}
	    }
	    else if (tag.match(/^(VB|R)/)) {					// Verb Phrase (verbs + adverbs)
	    	//Adverbs only at beginning
	    	if (oldCTag !== "VP" || tag.match(/(^R)/)) {
	    		if (chunk) { chunk_stem(chunk); chunks.push(chunk); }
	    		chunk = {tag: "VP", taggedTokens: []};
	    	}
	    }
	    else if (tag.match(/^(IN|TO)$/)) {						// Prepositional Phrase (IN)
	    	// Prepositions,TO only at beginning
	    	if (oldCTag !== "PP" || tag.match(/^(IN|TO)$/)) {
	    		if (chunk) { chunk_stem(chunk); chunks.push(chunk); }
	    		chunk = {tag: "PP", taggedTokens: []};
	    	}
	    }
	    else {												// Fragment (else)
	    	if (oldCTag !== "FRAG") {
	    		if (chunk) { chunk_stem(chunk); chunks.push(chunk); }
	    		chunk = {tag: "FRAG", taggedTokens: []};
	    	}
	    }
	    chunk.taggedTokens.push(taggedWords[i]);

	    oldWTag = tag;
    	oldCTag = chunk.tag;
	}
	chunk_stem(chunk);
	chunks.push(chunk);

	//console.log(chunks);
	return chunks;
}


/*MODULE EXPORTS*/
module.exports.get_phrases = get_chunks;