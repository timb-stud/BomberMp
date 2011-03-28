/*
	author: Tim Bartsch
	
	Session:
		Client side session framwork.
		
		Attributes:
			serverurl
				url to the server running the server side node.js session framework.
				
			initHandler
				function to call if the sessions is initiated
				
			msgHandler
				function to call if new message is received
				
			userHandler
				function to call if a new user joins the current session
*/
Session = function(serverUrl, initHandler, msgHandler, userHandler){
	var url = serverUrl,
		sid = 0,
		uid = 0;
	/*
		function to call after receiving the poll response
	*/
	var pollHandler = function(data){
		if(data.msg){
			var json = JSON.parse(data.msg);
			if(json.action){
				userHandler(json.action, json.uid);
			}else{
				msgHandler(json);
			}	
		}
		poll();
	};
	/*
		send an ajax request to the server
		used for long polling
	*/
	var poll = function(){
		var ajaxMsg = JSON.stringify({	"type": "poll",
										"sid": sid,
										"uid": uid});
		$.post(url, ajaxMsg, pollHandler, "json");
	};
	/*
		function to call after creating a new session
	*/
	var createHandler = function(data){
		sid = data.sid;
		uid = data.uid;
		initHandler(uid, sid);
		poll();
	};
	/*
		creates a new session on the server and connects to the session
	*/
	this.create = function(){
		var ajaxMsg = JSON.stringify({"type": "newSession"});
		$.post(url, ajaxMsg, createHandler, "json");
	};
	/*
		function to call after joining a session
	*/
	var joinHandler = function(data){
		uid = data.uid;
		initHandler(uid, sid);
		poll();
	};
	/*
		join an existing session
	*/
	this.join = function(sessionId){
		sid = sessionId;
		var ajaxMsg = JSON.stringify({	"type": "joinSession",
										"sid": sid});
		$.post(url, ajaxMsg, joinHandler, "json");
	};
	var sendHandler = function(data){
	};
	/*
		sends a message to all players in the same session
	*/
	this.send = function(msg){
		var ajaxMsg = JSON.stringify({	"type": "send",
										"sid": sid,
										"uid": uid,
										"msg": msg});
		$.post(url, ajaxMsg, sendHandler, "json");
	};
	/*
		Creates the url for players to join an existing game.
	*/
	this.getJoinUrl = function(){
		var url = window.location.href,
			expr = /sid\=(\d+)/;
		if(!expr(url)){
			url += "?sid=" + sid;
		}
		return url;
	}
};
