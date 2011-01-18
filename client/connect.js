var sid = 0;
var pid = 0;
var url = "http://localhost:8124";

function pollHandler(data){
	$("#status").html($("#status").html() + "<br>Poll: " + JSON.stringify(data));
	poll();
}

function poll(){
	var msg = JSON.stringify({	"type": "poll",
								"pid": pid,
								"sid": sid});
	$.post(url, msg, pollHandler, "json");
}

function newSessionHandler(data){
	sid = data.sid;
	pid = data.pid;
	$("#status").html("new Session: " + JSON.stringify(data));
	poll();
}

function newSession(){
	var msg = JSON.stringify({"type": "newSession"});
	$.post(url, msg, newSessionHandler, "json");
}

function joinSessionHandler(data){
	pid = data.pid;
	$("#status").html($("#status").html() + "<br>Join: " + JSON.stringify(data));
}

function joinSession(){
	sid = $("#sidBox").attr("value");
	var msg = JSON.stringify({"sid": sid, "type": "joinSession"});
	$.post(url, msg, joinSessionHandler, "json");
}

function sendHandler(data){
	$("#status").html($("#status").html() + "<br>Send: " + data);
}

function send(){
	var message = $("#msgBox").attr("value");
	var msg = JSON.stringify({	"type": "send",
								"pid": pid,
								"sid": sid,
								"msg": message});
	$.post(url, msg, sendHandler, "json");
}
