Session = function(serverUrl, initHandler, msgHandler, userHandler){
	var url = serverUrl,
		sid = 0,
		uid = 0;
	var pollHandler = function(data){
		console.log("pollHandler", data);
		if(data.msg){
			msgHandler(data.msg);
		}
		poll();
	};
	var poll = function(){
		var ajaxMsg = JSON.stringify({	"type": "poll",
										"sid": sid,
										"pid": uid});
		console.log(sid,uid, ajaxMsg);
		$.post(url, ajaxMsg, pollHandler, "json");
	};
	var createHandler = function(data){
		console.log("createHandler", data);
		sid = data.sid;
		uid = data.pid;
		initHandler(uid, sid);
		poll();
	};
	this.create = function(){
		var ajaxMsg = JSON.stringify({"type": "newSession"});
		$.post(url, ajaxMsg, createHandler, "json");
	};
	var joinHandler = function(data){
		console.log("joinHandler", data);
		uid = data.pid;
		initHandler(uid, sid);
		poll();
	};
	this.join = function(sessionId){
		sid = sessionId;
		var ajaxMsg = JSON.stringify({	"type": "joinSession",
										"sid": sid});
		$.post(url, ajaxMsg, joinHandler, "json");
	};
	var sendHandler = function(data){
		console.log("sendHandler", data);
	};
	this.send = function(msg){
		var ajaxMsg = JSON.stringify({	"type": "send",
										"sid": sid,
										"pid": uid,
										"msg": msg});
		$.post(url, ajaxMsg, sendHandler, "json");
	};
	this.getJoinUrl = function(){
		var url = window.location.href;
		url += "?sid=" + sid;
		return url;
	}
};
