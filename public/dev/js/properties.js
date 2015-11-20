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
			logout: "/app/logout",
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
			menubar: $('#menubar'),//menu bar
			menu_link: $("#nav > li > a"),//menu bar links
			menu_popup: $("#nav .selected div div"),
			menu_selected: $("#nav .selected"),
			about_link: $('#nav > li > #about_link'),
			connect_link: $('#nav > li > #connect_link'),

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
			connect_view: $('#box_connect'),// connect view
		}
	};
});