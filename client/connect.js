function msgHandler(msg){
	console.log("msgHandler", msg);
}

var url = "http://localhost:8124",
	session = new Session(url, msgHandler);


function newSession(){
	session.create();
}


function joinSession(){
	var sid = $("#sidBox").attr("value");
	session.join(sid);
}


function send(){
	var msg = $("#msgBox").attr("value");
	session.send(msg);
}
