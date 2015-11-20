"use strict";

require.config({
	paths: {
		jquery: "lib/jquery-1.10.2.min",
		jqCenter: "lib/jquery.center.min",
		jqCrypt: "lib/jquery.md5.min",
		animateColor: "lib/jquery.animate-colors",
		opentip: "lib/opentip-jquery-excanvas.min",
		jqMsg: "lib/jquery.msg.min"
	},
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
	}
});

require(["app"], function(App) { App(); });