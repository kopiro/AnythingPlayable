var __PORT__ = 9999;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

var provider = require('./lib/provider');
var sockets = [];

function emitState() {
	provider.getState(function(state) {
		if (state == null) {
			console.error("[SERVER] Unknown status");
			return;
		}

		sockets.forEach(function(socket) {
			if (!_.isEqual(state, socket.state)) {
				console.log('[CLIENT-'+socket.index+'] Status changed');

				console.log(state, socket.state);
				if (state.track_id !== socket.state.track_id) {
					console.log('[CLIENT-'+socket.index+'] Song changed');

					// Emit new track
					provider.getCurrent(function(track) {
						socket.emit('current', track);
					});
				}

				// Set new status and emit
				socket.state = state;
				socket.emit('state', socket.state);
			}
		});
	});
}

app.use('/', require('express').static(__dirname + '/public'));

io.on('connection', function(socket) {
	socket.index = sockets.length;
	socket.state = {};

	console.log('[CLIENT-'+socket.index+'] Connected');

	socket.on('disconnect', function(){
		sockets.splice(socket.index, 1);
		console.log('[CLIENT-'+socket.index+'] Disconnected');
	});

	socket.on('player.playpause', function() {
		console.log('[CLIENT-'+socket.index+'] PlayPause');
		provider.playPause(function(){
			emitState(socket);
		});
	});

	socket.on('player.next', function() {
		console.log('[CLIENT-'+socket.index+'] Next');
		provider.next(function(){
			emitState(socket);
		});
	});

	socket.on('player.previous', function() {
		console.log('[CLIENT-'+socket.index+'] Previous');
		provider.previous(function(){
			emitState(socket);
		});
	});

	socket.on('player.volume', function(e) {
		console.log('[CLIENT-'+socket.index+'] Volume');
		provider.setVolume(e.value);
	});

	sockets.push( socket );
});

setInterval(emitState, 1000);

//////////
// Init //
//////////

provider.set('spotify');
http.listen(__PORT__);
// require('child_process').exec('open http://localhost:' + __PORT__ + '/public');
