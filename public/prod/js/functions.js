"use strict";

define(['jquery', "properties",
		'jqMsg', 'animateColor', 'opentip'],
	function($, Props) {

		var Sel = Props.selectors
		  , Url = Props.urls;

	return {

		init: {
			// check session start or resume
			checkInit: function(callback) {
				$.get(Url['init'], function(data) {
					if (data.init === "start")// session start
						callback(false, data);
					else// session resume
						callback(true, data);
				});
			},
			
			// initializes page data
			initData: function(data) {
				//Init query type from entered text (if loaded from cache)
				if (Sel['input'].val().length > 0) Sel['input'].keyup();

				//Set learned memory objects to cache
				Sel['memory'].html(data);
				Sel['memory'].fadeTo('fast', 1);
			},

			// creates an Opentip instance
			// for HIA logo to show answers
			// and returns the hiaTip back
			initOpentip: function() {
				//Tooltip set
				var hiaTip = new Opentip("header img",
					{ ajax: false, ajaxMethod: "GET", ajaxErrorMessage: "...",
					  target: true, tipJoint: "right", offset: [0, 15], style: 'glass',
					  showOn: null, hideDelay: 3, group: 'hia' });

				return hiaTip;
			},

			initFocus: function() {
				Sel['input'].focus();// focus on input
				Sel['input'].select();// select text in input

				//Init query type from entered text (if loaded from cache)
				if (Sel['input'].val().length > 0) Sel['input'].keyup();
			}
		
		},//end init

		message: {
			setLoading: function(load) {
				// display a "loading..." message
				if (load === true) {
					$.msg({ msgID : 1,
	  					autoUnblock : false,
						clickUnblock : false,
						bgPath : '/img/',// /blank.gif
						fadeIn : 100,
						fadeOut : 100,
						content: 'Loading...',
						z : 5000
					});
				}
				// hide loading message
				else {
					$.msg( 'unblock', 100, 1);
				}
			},//end setLoading
		    
			initMsg: function(afterBlockFt, beforeUnblockFt) {
			    // shows the Msg at page load with a message from
			    // the box_intro html element, then calls callback function
				$.msg({ msgID : 2,
	  					autoUnblock : true, timeOut: 20000,// 20 seconds to unblock
						clickUnblock : true,
						bgPath : '/img/',// /blank.gif
						content: Sel['about_view'].html(),
						center : {
							topPercentage : 0.25
						},
						z : 2000,
						afterBlock : afterBlockFt,
						beforeUnblock: beforeUnblockFt
					});
			},//end initMsg

			displayDiv: function(selector, handler) {
				// Set selector html data to jqueryMsg
				$.msg({ msgID : 3,
					autoUnblock : false,
					clickUnblock : true,
					bgPath : '/img/',// /blank.gif
					content: selector.html(),
					center : {
						topPercentage : 0.25
					},
					z : 1000,
					afterBlock : (handler?handler:function() {})
				});
			},//end displayDiv
			hideDiv: function() {
				$.msg( 'unblock', 0, 3);
			},//end hideDiv

			openPage: function(pagename, callback) {
				// Get page partial data from server
				$.get(Url[pagename], function(data) {
					// display page data in message
					$.msg({ msgID : 3,
	  					autoUnblock : false,
						clickUnblock : true,
						bgPath : '/img/',// /blank.gif
						content: data,
						center : {
							topPercentage : 0.25
						},
						z : 1000,
						//afterBlock : null,
						beforeUnblock: (callback?callback:function() {})
					});
				});
			}//end openPage

		}//end message

	}//end return
	
});