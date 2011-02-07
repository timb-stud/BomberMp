var url = "http://localhost:8124",
	session = null;

function init(){
	session = new Session(url, initHandler, msgHandler, userHandler);
	var sid = getSidFromUrl();
	if(sid){
		session.join(sid);
	}
}

function getSidFromUrl(){
	var params = window.location.search,
		expr = /sid\=(\d{4})/,
		sid = 0;
		if(expr(params)){
			sid = expr(params)[1];
		}
		console.log("sidFromUrl", sid);
		return sid;
}

function initHandler(uid, sid){
	console.log("initHandler", uid, sid, session.getJoinUrl());
	$("#urlBox").attr("value", session.getJoinUrl());
}

function msgHandler(msg){
	console.log("msgHandler", msg);
}

function userHandler(action, uid){
	console.log("userHandler", action, uid);
};


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

$(document).ready(init);
