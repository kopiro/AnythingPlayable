var CURRENT = null;
var STATE = null;
var STATE_INTV = null;

function secToMin(x) {
	var m = Math.floor(x/60);
	var s = (x - m * 60);
	if (s < 10) s = '0' + s;
	return m + ':' + s;
}

var UI = {};

UI.updateCurrent = function() {
	if (!CURRENT) return;
	console.log('CURRENT', CURRENT);

	$('#current-name').text(CURRENT.name);
	$('#current-artist').text(CURRENT.artist);
	$('#current-duration').text(secToMin(CURRENT.duration));
	$('#current-artwork').css('background-image', 'url("'+CURRENT.artwork+'")');
	$('#art').css('background-image', 'url("'+CURRENT.artwork+'")');
};

UI.updateState = function() {
	if (!STATE) return;

	if (CURRENT) {
		$('#status-real').css('width', 100*STATE.position/CURRENT.duration+'%');
	}

	$('#status-position').text(secToMin(STATE.position));

	$('#control-main').attr('class', ({
		'0': 'fa fa-play',
		'1': 'fa fa-pause'
	}[STATE.state]));
};


var socket = io();

socket.on('current', function(e) {
	CURRENT = e;
	console.log('CURRENT', e);
	UI.updateCurrent();
});

socket.on('state', function(e) {
	STATE = e;
	console.log('STATE', e);
	UI.updateState();
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
	if (e.gesture.direction === 4) socket.emit('player.previous');
	else if (e.gesture.direction === 2) socket.emit('player.next');
});