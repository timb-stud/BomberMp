var sid = 0;
var pid = 0;
var url = "url:8124";

function pollHandler(data){
	$("#status").html($("#status").html() + "<br>Poll: " + data);
}

function poll(){
	var msg = JSON.stringify({	"type": "poll",
								"pid": pid,
								"sid": sid});
	$.post(url, msg, pollHandler, "json");
}

function newSessionHandler(data){
	$("#status").html("new Session" + data);
	var json = JSON.parse(data);
	sid = json.sid;
	pid = json.pid;
}

function newSession(){
	var msg = JSON.stringify({"type": "newSession"});
	$.post(url, msg, newSessionHandler, "json");
}

function joinHandler(data){
	var json = JSON.parse(data);
	pid = json.pid;
	$("#status").html($("#status").html() + "<br>Join: " + data);
}

function joinSession(){
	sid = $("#sidBox").attr("value");
	var msg = JSON.stringify({"sid": sid, "type": "joinSession"});
	$.post(url, msg, joinHandler, "json");
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
