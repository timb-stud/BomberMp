var SessionList = {
	sessions: [],
	addSession: function(){
		var sid = this.generateSid();
		var session = new Session(sid);
		this.sessions.push(session);
		return session;
	},
	getSession: function(sid){
		for(var i=0; i<this.sessions.length; i++){
			if(this.sessions[i].sid == sid){
				return this.sessions[i];
			}
		}
		return null;
	},
	generateSid: function(){
		min = 1000;
		max = 9999;
		return( min + parseInt(Math.random() * ( max-min+1 ), 10));
	}
};

Session = function(sid){
	this.sid = sid;
	this.users = [];
	this.addUser= function(){
		var uid = generateuid();
		var user = new User(uid);
		this.users.push(user);
		return user;
	};
	this.getUser = function(uid){
		for(var i=0; i < this.users.length; i++){
			if(this.users[i].uid == uid){
				return this.users[i];
			}
		}
		return null;
	};
	this.alertUsers = function(msg, uid){
		for(var i=0; i < this.users.length; i++){
			if(this.users[i].uid != uid){
				var json = JSON.stringify({"msg" : msg});
				console.log("uid: " + this.users[i].uid +  " res: " + this.users[i].response);
				var res = this.users[i].response;
				res.writeHead(200, {'Content-Type': 'text/plain',
									'Access-Control-Allow-Origin' : '*'});
				res.end(json);
				this.users[i].response = null;
			}
		}
	};
	var generateuid = function(){
		min = 100;
		max = 999;
		return( min + parseInt(Math.random() * ( max-min+1 ), 10));
	};
};

User = function(uid){
	this.uid = uid;
	this.response = null;
};

var SessionManager = {
	newSession: function(){
		var session = SessionList.addSession();
		var user = session.addUser();
		return JSON.stringify({"sid": session.sid, "uid": user.uid});
	},
	joinSession: function(sid){
		var session = SessionList.getSession(sid);
		var user = session.addUser();
		var msg = {action: "join", uid: user.uid};
		msg = JSON.stringify(msg);
		SessionManager.send(sid, user.uid, msg);
		return JSON.stringify({"uid": user.uid});
	},
	poll: function(sid, uid, res){
		var session = SessionList.getSession(sid);
		var user = session.getUser(uid);
		user.response = res;
	},
	send: function(sid, uid, msg){
		var session = SessionList.getSession(sid);
		session.alertUsers(msg, uid);
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
					this.poll(json.sid, json.uid, res);
					break;
			case "send":
					msg = this.send(json.sid, json.uid, json.msg);
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
		console.log("chunk: " + chunk);
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
