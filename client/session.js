Session = function(url, msgHandler){
	this.url = url;
	this.msgHandler = msgHandler;
	var sid = 0,
		uid = 0;
	var pollHandler = function(data){
		console.log("pollHandler", data);
		if(data.msg){
			this.msgHandler(data.msg);
		}
		poll();
	};
	var poll = function(){
		var ajaxMsg = JSON.stringify({	"type": "poll",
										"sid": sid,
										"pid": uid});
		$.post(this.url, ajaxMsg, pollHandler, "json");
	};
	var createHandler = function(data){
		console.log("createHandler", data);
		sid = data.sid;
		uid = data.pid;
		poll();
	};
	this.create = function(){
		var ajaxMsg = JSON.stringify({"type": "newSession"});
		$.post(this.url, ajaxMsg, createHandler, "json");
	};
	var joinHandler = function(data){
		console.log("joinHandler", data);
		var uid = data.pid;
		poll();
	};
	this.join = function(sessionId){
		sid = sessionId;
		var ajaxMsg = JSON.stringify({	"type": "joinSession",
										"sid": sid});
		$.post(this.url, ajaxMsg, joinHandler, "json");
	};
	var sendHandler = function(data){
		console.log("sendHandler", data);
	};
	this.send = function(msg){
		var ajaxMsg = JSON.stringify({	"type": "send",
										"sid": sid,
										"pid": pid,
										"msg": msg});
		$.post(this.url, ajaxMsg, sendHandler, "json");
	};
};
