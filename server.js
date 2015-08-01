var __PORT__ = 9999;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore');

var provider = require('./lib/provider');
var sockets = [];

function emitState() {
	provider.getState(function(state) {
		if (state == null) return;
		sockets.forEach(function(socket) {

			if (state.state != socket.state) {
				console.log('[CLIENT-'+socket.index+'] Status changed', socket.state, state.state);
				socket.state = state.state;
				socket.emit('state', state);
			}

			if (socket.track_id !== state.track_id) {
				console.log('[CLIENT-'+socket.index+'] Song changed', socket.track_id, state.track_id);
				socket.track_id = state.track_id;
				provider.getCurrent(function(track) {
					socket.emit('current', track);
				});
			}
		});
	});
}

app.use('/public', require('express').static(__dirname + '/public'));

io.on('connection', function(socket) {
	socket.index = sockets.length;
	socket.track_id = null;
	socket.state = null;

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

	sockets.push( socket );
});

setInterval(emitState, 1000);

//////////
// Init //
//////////

provider.set('spotify');
http.listen(__PORT__);
// require('child_process').exec('open http://localhost:' + __PORT__ + '/public');
