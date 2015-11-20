"use strict";
// /config/auth/account.js

var bcrypt = require('bcrypt-nodejs')
  , mongoose = require('mongoose')
  , conn = mongoose.get('user')
  ;

// define the schema for our user model
var accountSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

}, {safe: true});

// methods ======================
// generating a hash
accountSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
accountSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = conn.model('Account', accountSchema);