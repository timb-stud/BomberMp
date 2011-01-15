var SessionList = {
	sessions: new Array(),
	addSession: function(){
		var sid = this.gerateSid();
		var session = new Session(sid);
		sessions.push(session);
		return session;
	},
	getSession: function(sid){
		for(var session in sessions){
			if(session.sid == sid){
				return session;
			}
		}
	},
	generateSid: function(){
		min = 1000;
		max = 9999;
		return( min + parseInt(Math.random() * ( max-min+1 ), 10));
	}
};

Session = function(sid){
	this.sid = sid;
	this.players = new Array();
	this.addPlayer= function(){
		var pid = generatePid();
		var player = new Player(pid);
		this.players.push(player);
		return player;
	};
	this.getPlayer = function(pid){
		for(var player in players){
			if(player.pid == pid){
				return player;
			}
		}
	};
	this.alertPlayers = function(msg, pid){
		for(var player in players){
			if(player.pid != pid){
				var res = player.response;
				res.writeHead(200, {'Content-Type': 'text/plain',
									'Access-Control-Allow-Origin' : '*'});
				res.end(msg);
				player.response = null;
			}
		}
	};
	var generatePid = function(){
		min = 100;
		max = 999;
		return( min + parseInt(Math.random() * ( max-min+1 ), 10));
	};
};

Player = function(pid){
	this.pid = pid;
	this.response = null;
};

var SessionManager = {
	newSession: function(){
		var session = SessionList.addSession();
		var player = session.addPlayer();
		return JSON.stringify({"sid": session.sid, "pid": player.pid});
	},
	joinSession: function(sid){
		var session = SessionList.getSession(sid);
		var player = session.addPlayer();
		return JSON.stringify({"pid": player.pid});
	},
	poll: function(sid, pid, res){
		var session = SessionList.getSession(sid);
		var player = session.getPlayer(pid);
		player.response = res;
	},
	send: function(sid, pid, msg){
		var session = SessionList.getSession(sid);
		session.alertPlayers(msg, pid);
		return msg;
	},
	handle: function(req, res, chunk){
		var json = JSON.parse(chunk);
		var msg = null;
		switch(json.type){
			case "newSession":
					msg = this.newSession();
					break;
			case "joinSession":
					msg = this.joinSession(json.sid);
					break;
			case "poll":
					this.poll(json.sid, json.pid, res);
					break;
			case "send":
					msg = this.send(json.sid, json.pid, json.msg);
					break;
			default:
					console.log("Wrong query Type:" + json.type);
					break;
		}
		return msg;
	}
};

var http = require("http");
http.createServer(function(req, res){
	console.log("HTTP START");
	req.on("data", function(chunk){
		var msg = SessionManager.handle(req, res, chunk);
		if(msg){
			res.writeHead(200, {
				'Content-Type': 'text/plain',
				'Access-Control-Allow-Origin' : '*'
			});
			res.end(msg);
		}
		console.log("HTTP END");
	});	
}).listen(8124);

console.log("Server running at port 8124");
