function init(){
	$.post("127.0.0.1:8124", "newGame:1", handler, "json");
}

function handler(data){
	$("#status").html(data);
}

$(document).ready(init);
