"use strict";


var superagent = require('superagent')
  , expect = require('chai').expect
  , url = "http://localhost:8080"

// Test cases:
// Array of inputs and expected outputs
var cases = [
		["Moroccan is the nationality of Morocco", ["Moroccan", "be", "Morocco:nationality"] ],
		["I'm Black", ["$user:region", "be", "Africa"]],
		["I'm an Arab", ["$user:region", "be", "MENA"]],
		["I'm Moroccan", ["$user:country", "be", "Morocco"]],
		["We are Muslims", ["$other:religion", "be", "Islam"]],
		["He gave Jack 13 dollars", ["$other", "give", "Jack:dollar:13"]],
		["I'm twenty", ["$user:age", "be", "20"]]
	]

var testCase = function(text, nodeA, relation, nodeB, done) {
	console.log(text+" > "+nodeA+" "+relation+" "+nodeB)

	superagent.post(url+'/api/relations')
	  .send({ "text": text })
	  .end( function(err,res) {
	    expect(err).to.be.null
	    expect(res.body.relations).to.have.length.of(1)
	    expect(res.body.relations[0]).to.have.property('nodeA')
	    expect(res.body.relations[0].nodeA.name).to.equal(nodeA)
	    expect(res.body.relations[0]).to.have.property('name')
	    expect(res.body.relations[0].name).to.equal(relation)
	    expect(res.body.relations[0]).to.have.property('nodeB')
	    expect(res.body.relations[0].nodeB.name).to.equal(nodeB)
	    console.log(res.body.html)
	    done()
	})
}

describe('rest api test cases', function(){

	it('posts a relation object', function(done) {
		var i = 0
		testCase(cases[i][0], cases[i][1][0], cases[i][1][1], cases[i][1][2], done)
	})

	it('posts a relation object', function(done) {
		var i = 1
		testCase(cases[i][0], cases[i][1][0], cases[i][1][1], cases[i][1][2], done)
	})

	it('posts a relation object', function(done) {
		var i = 2
		testCase(cases[i][0], cases[i][1][0], cases[i][1][1], cases[i][1][2], done)
	})

	it('posts a relation object', function(done) {
		var i = 3
		testCase(cases[i][0], cases[i][1][0], cases[i][1][1], cases[i][1][2], done)
	})

	it('posts a relation object', function(done) {
		var i = 4
		testCase(cases[i][0], cases[i][1][0], cases[i][1][1], cases[i][1][2], done)
	})

	it('posts a relation object', function(done) {
		var i = 5
		testCase(cases[i][0], cases[i][1][0], cases[i][1][1], cases[i][1][2], done)
	})

	it('posts a relation object', function(done) {
		var i = 6
		testCase(cases[i][0], cases[i][1][0], cases[i][1][1], cases[i][1][2], done)
	})

})

describe('clean memory data', function() {

	it('removes relations collection', function(done){
		superagent.del(url+'/api/relations')
		  .end(function(err, res){
			expect(err).to.be.null
		    expect(res.status).to.eql(200)
		    expect(res.body.ok).to.equal(true)
		    done()
		})
	})

})