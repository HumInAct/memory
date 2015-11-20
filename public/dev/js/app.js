"use strict";

define(["functions", "events"],
	function(Fn, Events) {

		var Msg = Fn.message
		  , Init = Fn.init;

	return function() {
		//Msg.setLoading(true);// display loading message
		// set page data
		var hiaTip = Init.initOpentip();

		Init.checkInit( function(init, data) {
			if (init === false) {// session start
				Msg.initMsg(// intro message
					function() {//after block
						hiaTip.setContent(data.message);
					}
					, function() {//before unblock
						Init.initFocus();// input focus
						//Msg.setLoading(false);//hide loading message
						hiaTip.show();// hia tip message display
					}
				);
			}
			else {// session resume
				hiaTip.setContent(data.message);
				hiaTip.show();// hia tip message display
				Init.initData(data.memory);// memory relations data update
				//Init.initFocus();// input focus
				//Msg.setLoading(false);//hide loading message
			}
		});
		
		// prepare page interactions
		Events.setEvents(hiaTip);
	}

});