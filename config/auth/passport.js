"use strict";
// /config/auth/settings.js

var LocalStrategy = require('passport-local').Strategy
  ;

// expose this function to our app using module.exports
module.exports = function(passport, uri) {

    // initialize database connection
	require("./database")(uri);
    // instanciate an Account model from database
    var Account = require('./account');

	// passport session setup ==================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		Account.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// LOCAL SIGNUP ============================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-signup', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) {
		// asynchronous
		// Account.findOne wont fire unless data is sent back
		process.nextTick(function() {
    		// find a account whose email is the same as the forms email
    		// we are checking to see if the account trying to login already exists
    		Account.findOne({ 'local.email' :  email }, function(err, account) {
    			// if there are any errors, return the error
    			if (err) return done(err);

    			// check to see if theres already a account with that email
    			if (account) {
    				return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
    			} else {
    				// if there is no account with that email
    				// create the account
    				var newAccount            = new Account();

    				// set the account's local credentials
    				newAccount.local.email    = email;
    				newAccount.local.password = newAccount.generateHash(password);

    				// save the account
    				newAccount.save(function(err) {
    					if (err) throw err;
    					console.log("AUTH> Signup succeeded: "+JSON.stringify(newAccount.local));
    					return done(null, newAccount);
    				});
    			}
    		});
		});
	}));

	// LOCAL LOGIN =============================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-login', new LocalStrategy({
		// by default, local strategy uses username and password, we will override with email
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true // allows us to pass back the entire request to the callback
	}, function(req, email, password, done) { // callback with email and password from our form
		// find a account whose email is the same as the forms email
		// we are checking to see if the account trying to login already exists
		Account.findOne({ 'local.email' :  email }, function(err, account) {
			// if there are any errors, return the error before anything else
			if (err) return done(err);

			// if no account is found, return the message
			if (!account)
                // req.flash is the way to set flashdata using connect-flash
				return done(null, false, req.flash('loginMessage', 'No user found.'));

			// if the account is found but the password is wrong
			if (!account.validPassword(password))
                // create the loginMessage and save it to session as flashdata
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

			// all is well, return successful account
			console.log("AUTH> user '"+email+"' logged in");
			return done(null, account);
		});
	}));

};