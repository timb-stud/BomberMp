var sessions = new Array();
function getSession(id){
	for(var session in sessions){
		if(id == session.id){
			return session;
		}
	}
	return null;
}
Session = function(id){
	this.id = id;
	this.player1Res = null;
	this.player2Res = null;
};


var http = require("http");
http.createServer(function(req, res){
	console.log("req");
	req.on("data", function(chunk){
		var json = JSON.parse(chunk);
		console.log(json);
		if(json.newGame){
			var session = new Session(sessions.length);
			sessions.add(session);
			res.end(session.id);
		}else{
			if(json.poll){
				session = getSession(json.sessionId);
				switch(json.player){
					case "1":
						session.player1Res = res;
						break;
					case "2":
						session.player2Res = res;
						break;
				}
			}
		}
	});	
}).listen(8124);

console.log("Server running at port 8124");
