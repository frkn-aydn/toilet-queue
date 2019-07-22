var app = require('express')();
var http = require('http').createServer(app);
var socket = require('socket.io')(http);
var people = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

socket.on("connection", function (client) {
	client.on("join-toilet-line", function(name){
		people[client.id] = name;
		socket.sockets.emit("update-people", people);
	});

	client.on("remove-from-toilet-line", function(name){
        delete people[client.id];
        socket.sockets.emit("update-people", people);
    });

    client.on("get-list", function(){
        socket.sockets.emit("update-people", people);
    })
    
    client.on("disconnect", function(){
        delete people[client.id];
        socket.sockets.emit("update-people", people);
	});
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});