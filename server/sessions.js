var sessions = [];

function getSession(sid){
	return sessions[0];
//	for(var session in sessions){
//		if(sid == session.sid){
//			return session;
//		}
//	}
//	return null;
}

Session = function(uid){
	var makeSid = function(){
		min = 100;
		max = 999;
		return( min + parseInt(Math.random() * ( max-min+1 ), 10));
	};
	this.setRes = function(uid, res){
		if(uid == this.uid1){
			this.ures1 = res;
		}else{
			if(uid == this.uid2){
				this.ures2 = res;
			}
		}
	};
	this.getRes = function(uid){
		if(uid == this.uid1){
			return this.uid1;
		}
		if(uid == this.uid2){
			return this.ures2;
		}
	};
	this.join = function(uid){
		uid2 = uid;
	};
	this.sid = makeSid();
	var uid1 = uid;
	var uid2 = 0;
	var ures1 = null;
	var ures2 = null;
};

var http = require("http");
http.createServer(function(req, res){
	console.log("req");
	req.on("data", function(chunk){
		var json = JSON.parse(chunk);
		var session = null;
		console.log(json);
		switch(json.type){
			case "newGame":
					session = new Session(json.uid);
					console.log("create Session: " + session.sid)
					sessions.push(session);
					res.writeHead(200, {
						'Content-Type': 'text/plain',
						'Access-Control-Allow-Origin' : '*'
					});
					res.end("" + session.sid);
					break;
			case "join":
					session = getSession(json.sid);
					session.join(json.uid);
					break;
			case "poll":
					session = getSession(json.sid);
					session.setRes(json.uid, res);
					break;
			case "send":
					session = getSession(json.sid);
					var response = session.getRes(json.uid);
					response.writeHead(200, {
						'Content-Type': 'text/plain',
						'Access-Control-Allow-Origin' : '*'
						});
					response.end(json.msg);
					break;
			default:
					console.log("Wrong query Type:" + json.type);
					break;
		}
	});	
}).listen(8124);

console.log("Server running at port 8124");
