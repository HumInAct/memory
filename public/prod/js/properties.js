"use strict";

/*
* Access HTML jQuery selectors
*/
define(["jquery"], function($) {
	return {
		urls: {
			//APP
			ping: "/app/ping",
			init: "/app/init",
			login: "/app/login",
			signup: "/app/signup",
			//API
			relations: "/api/relations",
			//Partials
			partial: "/partials",
			menu: "/partials/menu",
		},

		selectors: {

			// Widgets
			ajax_loader: $('.loader'),//ajax loader gif div

			// Menu content
			menu_link: $("#nav > li > a"),//menu bar link
			menu_popup: $("#nav .selected div div"),
			menu_selected: $("#nav .selected"),
			home_link: $('#nav > li > #home_link'),
			about_link: $('#nav > li > #about_link'),
			login_link: $('#nav > li > #login_link'),
			signup_link: $('#nav > li > #signup_link'),

			// Wrapper content
			wrapper: $('.wrapper'),//body wrapper
			box: $('.box'),//box element
			input: $('#main-input'),// info/query text input
			submit: $('#main-button'),// query/info submit button
			output: $('#main-display'),// relation query display area
			memory: $('#memory.display'),// memory relations display area
			refresh: $('#refresh-button'),// refresh link
			forget: $('#forget-button'),// forget link

			// Hidden views
			about_view: $('#box_about'),// message shown at session start
			login_view: $('#box_login'),// login view
			signup_view: $('#box_signup'),// signup view
		}
	};
});