var sessions = new Array();
function getSession(sid){
	for(var session in sessions){
		if(sid == session.sid){
			return session;
		}
	}
	return null;
};
Session = function(){
	var makeSid = function(){
		min = 100;
		max = 999;
    	return( min + parseInt(Math.random() * ( max-min+1 )));
	};
	this.sid = makeSid();
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
			var session = new Session();
			sessions.push(session);
			res.writeHead(200, {
            	'Content-Type': 'text/plain',
            	'Access-Control-Allow-Origin' : '*'
        	});
			res.end("" + session.sid);
		}else{
			if(json.poll){
				session = getSession(json.sid);
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
