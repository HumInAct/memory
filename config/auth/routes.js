"use strict";
// /config/auth/routes.js

var swig = require('swig')
  , menuTmpl = swig.compileFile("views/menubar.html")
  ;

module.exports = function(server, passport) {

	// LOGIN ===============================

	// process the login form
	server.post('/app/login', function(req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
			if (err) {
				return next(err); // will generate a 500 error
			}
			// Generate a JSON response reflecting authentication status
			if (! user) {
				return res.json({ ok : false, message : req.flash('loginMessage') });
			}
			//SUCCESS
			console.log(user.local.email);
			req.user = user.local.email;
			return res.json({ ok : true, message : req.flash('loginMessage'),
							  menubar: menuTmpl({"authenticated": true}) });
		})(req, res, next);
	});

	// process the signup form
	server.post('/app/signup', function(req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
		    if (err) {
		      return next(err); // will generate a 500 error
		    }
		    // Generate a JSON response reflecting authentication status
		    if (!user) {
		      return res.json({ ok : false, message : req.flash('signupMessage') });
		    }

		    //SUCCESS
		    return res.json({ ok : true, message : req.flash('signupMessage') });
		})(req, res, next);
	});

	// PROFILE SECTION =====================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	server.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// LOGOUT ==============================
	server.get('/app/logout', function(req, res) {
		console.log(req.logout());
		req.logout();
		delete req.user;
		res.redirect('/');
	});
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.user) return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}