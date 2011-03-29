/*
	author: Tim Bartsch
	Node.js session framework for creating game or chat sessions.
*/

/*
	SessionList:
		Array of 100 sessions. The position of the session in the array depends on the session id.
		The session with sid=0 is stored on the first place, session with sid=1 is stored on the second place and so on...
*/
var SessionList = {
	sessions: new Array(100),
	/*
		Adds a sesion to the list
	*/
	addSession: function(){
		var sid = this.getFreeSid();
		if(sid >= 0){
			var session = new Session(sid);
			this.sessions[sid] = session;
			return session;
		}
	},
	/*
		returns the session with the corresponding sid
	*/
	getSession: function(sid){
		if(sid >= 0 && sid < this.sessions.length){
			return this.sessions[sid];
		}
	},
	/*
		removes the session with the corresponding sid
	*/
	removeSession: function(sid){
		if(sid >= 0 && sid < this.sessions.length){
			var session = this.sessions[sid];
			this.sessions[sid] = null;
			return session;
		}
	},
	/*
		searches a free postion in the array and returns it
	*/
	getFreeSid: function(){
		for(var i=0; i < this.sessions.length; i++){
			if(this.sessions[i] == null){
				return i;
			}
		}
		return -1;
	}
};

/*
	Session:
		represents a session with a sid, a user list and a posibility of sending the users messages.
*/
Session = function(sid){
	this.sid = sid;
	this.users = [];
	/*
		add an user to the session
	*/
	this.addUser= function(){
		var uid = generateuid();
		var user = new User(uid);
		this.users.push(user);
		return user;
	};
	/*
		returns the user with the corresponding uid
	*/
	this.getUser = function(uid){
		for(var i=0; i < this.users.length; i++){
			if(this.users[i].uid == uid){
				return this.users[i];
			}
		}
		return null;
	};
	/*
		sends msg to all users except for the user with uid
	*/
	this.alertUsers = function(msg, uid){
		for(var i=0; i < this.users.length; i++){
			if(this.users[i].uid != uid){
				this.users[i].alert(msg);
			}
		}
	};
	/*
		generates a new uid
	*/
	var generateuid = function(){
		min = 1000;
		max = 9999;
		return( min + parseInt(Math.random() * ( max-min+1 ), 10));
	};
};

/*
	User:
		represents a user with its user id, response object and message queue.
*/
User = function(uid){
	this.uid = uid;
	var response = null;
	this.timeoutTime = 0;
	this.msgQueue = [];
	/*
		sets the response object
	*/
	this.setResponse = function(resp){
		response = resp;
		this.timeoutTime = 0;
	};
	/*
		returns the response object
	*/
	this.getResponse = function(){
		return response;
	};
	/*
		adds the msg to the msg query and tries to send the msg if an response is available
	*/
	this.alert = function(msg){
		this.msgQueue.push(msg);
		if(response){
			msg = this.msgQueue.shift();
			this.sendMsg(msg);
		}
	};
	/*
		sends a msg to the user
	*/
	this.sendMsg = function(msg){
		if(response){
			var json = JSON.stringify({"msg" : msg});
			response.writeHead(200, {	'Content-Type': 'text/plain',
											'Access-Control-Allow-Origin' : '*'});
			response.end(json);
			response = null;
		}
	};
};

/*
	SessionManager:
		Handles incoming requests for:
		
			creating a new session
			joining into an existing session
			sending a message
			make a poll request. (used for long polling)
*/
var SessionManager = {
	/*
		create a new session
	*/
	newSession: function(){
		var session = SessionList.addSession();
		if(session){
			var user = session.addUser();
			return JSON.stringify({"sid": session.sid, "uid": user.uid});
		}
	},
	/*
		join an existing session
	*/
	joinSession: function(sid){
		var session = SessionList.getSession(sid);
		var user = session.addUser();
		var msg = {action: "join", uid: user.uid};
		msg = JSON.stringify(msg);
		SessionManager.send(sid, user.uid, msg);
		return JSON.stringify({"uid": user.uid});
	},
	/*
		handles a poll request
		used for long polling
	*/
	poll: function(sid, uid, res){
		var session = SessionList.getSession(sid);
		var user = session.getUser(uid);
		user.setResponse(res);
		var msg = user.msgQueue.shift();
		if(msg){
			user.sendMsg(msg);
		}
	},
	/*
		sends a msg to all users in a session except for the user with the given uid
	*/
	send: function(sid, uid, msg){
		var session = SessionList.getSession(sid);
		session.alertUsers(msg, uid);
		return msg;
	},
	/*
		handles http requests
	*/
	handle: function(req, res, chunk){
		var msg = null;
		try{
			var json = JSON.parse(chunk);
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
		}catch(e){
		}
		return msg;
	}
};

/*
	http Server:
		accepts incoming http requests and forwards them to the SessionManager
*/
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

setInterval(checkUsers, 2000);

/*
	checkUsers:
		Checks if users are connected with the server.
		Removes sessions on users timeouts.
*/
function checkUsers(){
	var sessions = SessionList.sessions;
	for(var i=0; i < sessions.length; i++){
		if(sessions[i]){
			var users = sessions[i].users;
			for(var j=0; j < users.length; j++){
				if(users[j].getResponse() == null){
					users[j].timeoutTime += 1;
				}
				if(users[j].timeoutTime > 5){
					sessions[i] = null;
					console.log("KILLED", i)
				}
			}
		}
	}
}

console.log("Server running at port 8124");
