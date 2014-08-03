global.__CACHE__ = __dirname+'/cache';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var _id = null;
var P = new (require('./lib/provider'))('spotify');

setInterval(function() {
	emitState(null);
	emitCurrent(null, true);
}, 500);

function emitState(socket) {
	socket = socket || io;

	P.getState(function(err, state) {
		socket.emit('state', state);
	});
}

function emitCurrent(socket, check) {
	socket = socket || io;

	P.getCurrent(function(err, now) {
		if (err || !now) return;
		if (check && (_id===now._id)) return;
		_id = now._id;

		console.log("[SERVER] Song changed!");

		socket.emit('current', now);
	});
}


app.use('/public', require('express').static(__dirname+'/public'));

io.on('connection', function(socket){
	console.log('[SERVER] User connected');

	emitCurrent(socket);
	emitState(socket);

	socket.on('disconnect', function(){
		console.log('[SERVER] User disconnected');
	});

	socket.on('player.playpause', function() {
		P.playPause(function(){
			emitState();
		});
	});

	socket.on('player.next', function() {
		P.next(function(){
			emitCurrent();
			emitState();
		});
	});

	socket.on('player.previous', function() {
		P.previous(function(){
			emitCurrent();
			emitState();
		});
	});

});


app.get('/current/artwork', function(req, res) {
	P.getCurrentArtwork(function(err, o) {
		if (err) return res.end();
		res.sendfile(o);
	});
});

http.listen(9999);