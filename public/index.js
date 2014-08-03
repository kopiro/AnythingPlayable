var CURRENT = null;
var STATE = null;
var STATE_INTV = null;

function secToMin(x) {
	var m = Math.floor(x/60);
	var s = (x-m*60);
	if (s<10) s = '0'+s;
	return m+":"+s;
}

var UI = {};

UI.updateCurrent = function() {
	if (!CURRENT) return;

	$('#current-name').text(CURRENT.name);
	$('#current-artist').text(CURRENT.artist);
	$('#current-duration').text(secToMin(CURRENT.duration));
	$('#current-artwork').css('background-image', 'url("'+CURRENT.artwork+'")');
	$('#art').css('background-image', 'url("'+CURRENT.artwork+'")');
};

UI.updateState = function() {
	if (!STATE) return;

	if (CURRENT) $('#status-real').css('width', 100*STATE.position/CURRENT.duration+'%');
	$('#status-position').text(secToMin(STATE.position));

	$('#control-main').attr('class', ({
		'PAUSED': 'fa fa-play',
		'PLAYING': 'fa fa-pause'
	}[STATE.state]));
};


var socket = io();

socket.on('current', function(e) {
	CURRENT = e;
	UI.updateCurrent();
});

socket.on('state', function(e) {
	STATE = e;
	UI.updateState();

	// hack the system
	clearInterval(STATE_INTV);
	if (STATE.state==='PLAYING') {
		STATE_INTV = setInterval(function() {
			STATE.position++;
			UI.updateState();
		}, 1000);
	}
});



/*
Listeners
*/

$('#control-main').hammer().bind('click', function() {
	socket.emit('player.playpause');
});

$('#control-prev').hammer().bind('click', function() {
	socket.emit('player.previous');
});

$('#control-next').hammer().bind('click', function() {
	socket.emit('player.next');
});

$('body').hammer().bind('swipe', function(e) {
	if (e.gesture.direction===4) socket.emit('player.previous');
	else if (e.gesture.direction===2) socket.emit('player.next');
});