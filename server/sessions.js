var sessions = [];
Session = function(id){
	this.id = id;
	this.player1Req = null;
	this.player2Req = null;
};


var http = require("http");
http.createServer(function(req, res){
	if(req.get == "newGame"){
		var session = new Session(sessions.length);
		sessions.add(session);
		res.end(session.id);
	}
	
}).listen(8124);

console.log("Server running at port 8124");