"use strict";

var superagent = require('superagent')
  , expect = require('chai').expect
  , url = "http://localhost:8080"


describe('express rest api server', function(){

	it('posts a relation object', function(done){
		superagent.post(url+'/api/relations')
		  .send({ text: 'This is a first test' })
		  .end(function(err,res){
		    expect(err).to.be.null
		    expect(res.status).to.eql(200)
		    expect(res.body).to.be.ok
		    expect(res.body).to.be.an('object')
		    expect(res.body).to.have.property('html')
		    expect(res.body.html).to.match(/^<p>.*<\/p>$/)
		    expect(res.body).to.have.property('relations')
		    expect(res.body.relations).to.have.length.of.at.least(1)
		    console.log(res.body.html)
		    done()
		})
	})

	it('posts a relation object', function(done){
		superagent.post(url+'/api/relations')
		  .send({ text: 'This is a second test' })
		  .end(function(err,res){
		    expect(err).to.be.null
		    expect(res.status).to.eql(200)
		    expect(res.body).to.be.ok
		    expect(res.body).to.be.an('object')
		    expect(res.body).to.have.property('html')
		    expect(res.body.html).to.match(/^<p>.*<\/p>$/)
		    expect(res.body).to.have.property('relations')
		    expect(res.body.relations).to.have.length.of.at.least(1)
		    console.log(res.body.html)
		    done()
		})
	})

	it('retrieves a relations collection', function(done){
		superagent.get(url+'/api/relations')
		  .end(function(err, res){
			expect(err).to.be.null
		    expect(res.status).to.eql(200)
		    expect(res.text).to.be.ok
		    expect(res.text).to.match(/^<p>.*<\/p>$/)
		    console.log(res.text)
		    done()
		})
	})

	it('removes a relations collection', function(done){
		superagent.del(url+'/api/relations')
		  .end(function(err, res){
		    // console.log(res.body)
			expect(err).to.be.null
		    expect(res.status).to.eql(200)
		    expect(res.body).to.be.ok
		    expect(res.body).to.be.an('object')
		    expect(res.body).to.have.property('ok')
		    expect(res.body.ok).to.equal(true)
		    done()
		})
	})
})