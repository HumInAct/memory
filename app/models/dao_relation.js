"use strict";
// /app/models/dao_relation.js

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , conn = mongoose.get('memory')
  ;

// define the schema for our user model
var relSchema = Schema({

    _id          : Schema.ObjectId,
    id           : Number,
    name         : String,
    nodeA        : String,
    nodeB        : String,
    properties   : [
        {
            key  : String,
            value: String
        }
    ],
    date         : Date

}, {collection:"relations", safe: true});


// create the model for users and expose it to our app
module.exports = conn.model('Relation', relSchema);