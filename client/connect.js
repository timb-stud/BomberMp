var sid = 0;
var url = "url:8124";
function init(){
	var msg = JSON.stringify({"type": "newGame"});
	$.post(url, msg, newGameHandler, "json");
}

function newGameHandler(data){
	$("#status").html("new Game" + data);
	sid = data;
	var msg = JSON.stringify({	"type": "poll",
								"sid": sid});
	$.post(url, msg, pollHandler, "json");
}

function pollHandler(data){
	$("#status").html($("#status").html() + "<br>Poll: " + data);
}

$(document).ready(init);
