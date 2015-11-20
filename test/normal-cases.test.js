"use strict";


var superagent = require('superagent')
  , expect = require('chai').expect
  , url = "http://localhost:8080"

// Test cases:
// Array of inputs and expected outputs
var cases = [
		["My friend likes my father's super car", ["$user:friend", "like", "$user:father:car=super"] ],
		["Students happily do their homeworks", ["student", "do=happily", "$other:homework"] ],
		["My father works a lot", ["$user:father", "work", "lot"] ],
		["I have twenty-three little balls", ["$user", "have", "ball:23=little"]],
		["The father of my father is my grandfather", ["$user:father:father", "be", "$user:grandfather"]]
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

	it('removes a relations collection', function(done){
		superagent.del(url+'/api/relations')
		  .end(function(err, res){
			expect(err).to.be.null
		    expect(res.status).to.eql(200)
		    expect(res.body.ok).to.equal(true)
		    done()
		})
	})

})