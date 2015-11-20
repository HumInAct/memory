"use strict";
// /app/factories/factory_data.js

// Module import
var dataFolder = "./data/knowledge";
var fs  = require("fs");

// Data Factory object
function Factory() {
	//TXT
	this.dataRegions = fs.readFileSync(dataFolder+'/regions.txt').toString().split('\n');
	this.dataReligions = fs.readFileSync(dataFolder+'/religions.txt').toString().split('\n');
	this.dataNations = fs.readFileSync(dataFolder+'/nations.txt').toString().split('\n');
	//CSV
	this.dataOceans = fs.readFileSync(dataFolder+'/oceans.csv').toString().split(',');
	//JSON
	this.dataNumbers = JSON.parse(fs.readFileSync(dataFolder+'/numbers.json'));
}

/*********************************PROPER NOUNS************************************/
Factory.prototype.is_region = function(NNP) {
	for(var i in this.dataRegions) {
		var data = this.dataRegions[i].split(",");
		for(var j in data) {
			if (new RegExp("^"+NNP+"$", "i").test(data[j])
				|| new RegExp("^"+NNP+"$", "i").test(data[j]+"s"))
				return data[0];
		}
	}
};
Factory.prototype.is_religion = function(NNP) {
	for(var i in this.dataReligions) {
		var data = this.dataReligions[i].split(",");
		for(var j in data) {
			if (new RegExp("^"+NNP+"$", "i").test(data[j])
				|| new RegExp("^"+NNP+"$", "i").test(data[j]+"s"))
				return data[0];
		}
	}
};
Factory.prototype.is_country = function(NNP) {
	for(var i in this.dataNations) {
		var data = this.dataNations[i].split(",");
		for(var j in data) {
			if (new RegExp("^"+NNP+"$", "i").test(data[j])
				|| new RegExp("^"+NNP+"$", "i").test(data[j]+"s"))
				return data[0];
		}
	}
};
Factory.prototype.is_ocean = function(NNP) {
	for(var i in this.dataOceans) {
		if (new RegExp("^"+NNP+"( [Oo]cean)?$", "i").test(this.dataOceans[i])
			|| new RegExp("^"+NNP+"( [Oo]cean)?$", "i").test(this.dataOceans[i]+"s"))
			return this.dataOceans[i];
	}
};

/***********************************FUNCTIONS****************************************/
/*
  Returns the type of proper noun
  from the data knowledge
  and the value of that noun
  {type:"", value=""}
*/
Factory.prototype.check_nnp = function(NNP) {
	var value;
	if (value = this.is_region(NNP)) return {"type":"region", "value":value};
	if (value = this.is_religion(NNP)) return {"type":"religion", "value":value};
	if (value = this.is_country(NNP)) return {"type":"country", "value":value};
	if (value = this.is_ocean(NNP)) return {"type":"ocean", "value":value};

	return {"type":"name", "value":NNP};
};

/*Number*/
Factory.prototype.is_number = function(NN) {
	return this.dataNumbers[NN];
};
Factory.prototype.check_cd = function(NN) {
	if (NN.match(/[-]/)) {
		var numbers = [], notNumbers = [];
		var tokens = NN.split('-');

		for(var i in tokens) {
			var value = this.is_number(tokens[i]);
			if (value)
				numbers.push(value);
			else notNumbers.push(tokens[i]);
		}
		return {"numbers":numbers, "notNumbers":notNumbers};
	}
	else {
		var value = this.is_number(NN);
		if (value) return value;
	}
};

/*********************************************************************************/

// Factory Singleton export
var factory = new Factory();
module.exports = factory;

/*TESTS*
Factory factory = new Factory();
console.log(factory.is_country("moroccan"));
console.log(factory.is_country("french"));
console.log(factory.is_country("American"));
console.log(factory.is_religion("muslim"));
console.log(factory.is_religion("Islam"));
console.log(factory.is_ocean("pacific ocean"));
//*/