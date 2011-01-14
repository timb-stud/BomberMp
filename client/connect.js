var sid = 0;
var uid = parseInt(Math.random() * 1000);
var url = "url:8124";

function pollHandler(data){
	$("#status").html($("#status").html() + "<br>Poll: " + data);
}

function poll(){
	var msg = JSON.stringify({	"type": "poll",
								"uid": uid,
								"sid": sid});
	$.post(url, msg, pollHandler, "json");
}

function newGameHandler(data){
	$("#status").html("new Game" + data);
	sid = data;
	poll();
}

function newGame(){
	var msg = JSON.stringify({	"uid": uid,
								"type": "newGame"});
	$.post(url, msg, newGameHandler, "json");
}

function joinHandler(data){
	$("#status").html($("#status").html() + "<br>Join: " + data);
	poll();
}

function join(){
	var msg = JSON.stringify({	"uid": uid,
								"sid": sid,
								"type": "join"});
	$.post(url, msg, joinHandler, "json");
}

function sendHandler(data){
	$("#status").html($("#status").html() + "<br>Send: " + data);
}

function send(){
	var message = $("#msgBox").attr("value");
	var msg = JSON.stringify({	"type": "send",
								"uid": uid,
								"sid": sid,
								"msg": message});
	$.post(url, msg, sendHandler, "json");
}
