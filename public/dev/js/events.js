"use strict";

define(['jquery', "properties", "functions",
		'jqCrypt', 'opentip', 'animateColor'],
	function($, Props, Fn) {

		var Sel = Props.selectors
		  , Url = Props.urls
		  , Msg = Fn.message;
	
	return {
	    setEvents: function(hiaTip) {
			
			var query_type = 'i';

			//===============================================================================
			/*TOP MENU BAR*/

			//About view
			Sel['about_link'].click(function(event) {
				Msg.displayDiv(Sel['about_view']);
			});
			//Login view
			Sel['connect_link'].click(function(event) {
				Msg.displayDiv(Sel['connect_view'], function() {
					//Cancel
					$('input[name=cancel]').click(function(event) {
						Msg.hideDiv();
					});
					//Login
					$('form').on('submit', function(event) {
						event.preventDefault();
						var req = {};
						req.email = $(this).find('input[name=email]').val();
						req.password = $.md5($(this).find('input[name=password]').val());
						console.log(req);
						Sel['ajax_loader'].show();//loader
						$.post(Url[$(this).attr('name')], req, "json")
							.done( function(res) {
								Sel['ajax_loader'].hide();//loader
								if (res.ok === true) {//success
									Sel['menubar'].html(res.menubar);
									Msg.hideDiv();
								}
								else alert(res.message);//error
							})
						    .fail( function(xhr, textStatus, errorThrown) {
								Sel['ajax_loader'].hide();
						        alert(xhr.responseText);
						    });

						return false;
					});
				});
			});

			$(document).on('click', '#memory_link', function(event) {
			});

			//===============================================================================
			/*MAIN APP INPUT*/

			// disable line breaks on contenteditable elements
			$(document).on('keypress', '.editable', function(event) {
			    return event.which != 13;
			});

			/*Text input type change*/
			Sel['input'].keyup(function(event) {
				var text = $(this).val();

				if (text.match(/\?$/) && query_type !== 'q') {
					Sel['submit'].text('Ask');
					query_type = 'q';
				}
				else if (!text.match(/\?$/) && query_type !== 'i') {
					Sel['submit'].text('Tell');
					query_type = 'i';
				}
			});

			/* Keypad Key press event */
			Sel['input'].keypress(function(event) {
				hiaTip.hide();
				if (event.which === 13) {//	[ENTER]
					Sel['submit'].click();
				}
			});


			/* AJAX Data parse + update */
			Sel['submit'].click(function(event) {
				hiaTip.hide();
				var val = Sel['input'].val();
				if (val.length > 0) {
					Sel['ajax_loader'].show();//loader
					Sel['input'].css('backgroundColor', "#0CF");//input bg color
					
					Sel['output'].fadeTo('fast', 0,
						function() {
							//API POST
						$.post(Url['relations'], {text:val}, "json")
							.done(function(res) { // success
								Sel['ajax_loader'].hide();//loader
				            	Sel['output'].html(res.html);
				            	Sel['output'].fadeTo('fast', 1);

				            	//HIA Answer
			            		hiaTip.setContent(res.answer);
			            		hiaTip.show();
							})
							.fail(function(xhr, textStatus, errorThrown) { // error
								Sel['ajax_loader'].hide();//loader
						        alert(xhr.responseText);
							});
		        	});
		        	//Sel['input'].val('');//clear input text
		        	Sel['input'].select();//select input text
					Sel['input'].animate({backgroundColor: "#FFF"}, 'slow');//input bg color animate
				}
				else {//Error message if no text entered
					Sel['output'].text('no text entered!');
				}
			});//*/

			//===============================================================================
			/*OTHER WIDGETS*/

			/* Forget last added relation from memory */
			$(document.body).on('click', '.forget-last', function(event) {
				var thisUrl = Url['relations']+"/"+$(this).attr('id');
				
				Sel['output'].fadeTo('fast', 0,
						function() {
					$.ajax({
						//append id/n of last relation from DOM
					    url: thisUrl,
					    type: 'DELETE',
					    success: function(res) {
					    	if (res.ok) {//success
					        	Sel['output'].text("-relation removed-");
					        }
					        else {//error
					        	Sel['output'].text("an error occured!");
					        }
					        Sel['output'].fadeTo('fast', 1);
					    }
					});
				});
			});

			/* Refresh memory data */
			Sel['refresh'].click(function(event) {
		    	Sel['memory'].fadeTo('fast', 0,
					function(){
						//API GET
					$.get(Url['relations'],
						function(data) {
						Sel['memory'].html(data);
						Sel['memory'].fadeTo('fast', 1);
					});
				});
			});

			/* Forget memory data */
			Sel['forget'].click(function(event) {
		    	Sel['memory'].fadeTo('fast', 0,
					function() {
						//API DELETE
					$.ajax({
					    url: Url['relations'],
					    type: 'DELETE',
					    success: function(res) {
					    	if (res.ok) {//success
					        	Sel['memory'].text("-all objects forgotten-");
					        }
					        else {//error
					        	Sel['memory'].text("an error occured!");
					        }
					        Sel['memory'].fadeTo('fast', 1);
					    }
					});
				});
			});

		}//end setEvents

	};//end return

});