var sid = 0;
var uid = parsseInt(Math.random() * 1000);
var url = "url:8124";

function newGame(){
	var msg = JSON.stringify({	"uid": uid,
								"type": "newGame"});
	$.post(url, msg, newGameHandler, "json");
}

function newGameHandler(data){
	$("#status").html("new Game" + data);
	sid = data;
	poll();
}

function joinGame(){
	var msg = JSON.stringify({	"uid": uid,
								"sid": sid,
								"type": "join"});
	$.post(url, msg, joinHandler, "json");
}

function joinHandler(data){
	$("#status").html($("#status").html() + "<br>Join: " + data);
	poll();
}

function poll(){
	var msg = JSON.stringify({	"type": "poll",
								"uid": uid,
								"sid": sid});
	$.post(url, msg, pollHandler, "json");
}

function pollHandler(data){
	$("#status").html($("#status").html() + "<br>Poll: " + data);
}

function send(){
	var msg = JSON.stringify({	"type": "send",
								"uid": uid,
								"sid": sid});
	$.post(url, msg, sendHandler, "json");
}

function sendHandler(data){
	$("#status").html($("#status").html() + "<br>Send: " + data);
}


$(document).ready(init);
