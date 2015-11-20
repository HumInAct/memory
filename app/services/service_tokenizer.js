var natural = require('natural')
  ;

var treebank_tokenize = function(text) {
	var tokenizer = new natural.TreebankWordTokenizer();
	var tokens = tokenizer.tokenize(text);

	return tokens;
};

var regexp_tokenize = function(text, rule) {
	rule = typeof rule !== 'undefined' ? rule : /( |\.|,|\')+/;
	var tokenizer = new natural.RegexpTokenizer(
		{pattern: rule}
		);
	var tokens = tokenizer.tokenize(text);

	return tokens;
};


/*Module Exports*/
module.exports.tokenize = treebank_tokenize;
module.exports.regexp = regexp_tokenize;