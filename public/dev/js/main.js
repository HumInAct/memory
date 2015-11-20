"use strict";

require.config({
	// cache-bust
	urlArgs: new Date().getTime().toString(),
	
	// import libraries
	paths: {
		// jQuery lib & plugins
		jquery: "lib/jquery-1.10.2.min",
		jqCenter: "lib/jquery.center.min",
		jqCrypt: "lib/jquery.md5.min",
		animateColor: "lib/jquery.animate-colors",
		opentip: "lib/opentip-jquery-excanvas.min",
		jqMsg: "lib/jquery.msg.min"
	},
	
	// configure libraries
	shim: {
		jquery: {
			exports: "$"
		},
		jqCenter: {
			deps: ['jquery']
		},
		jqCrypt: {
			deps: ['jquery']
		},
		animateColor: {
			deps: ['jquery']
		},
		opentip: {
			deps: ['jquery']
		},
		jqMsg: {
			deps: ['jquery', 'jqCenter']
		}
	},

	name: "main",
    out: "main-built.js"
});

// Load the main app modules to start the app
require(["app"], function(App) {
	App();// Start application
});