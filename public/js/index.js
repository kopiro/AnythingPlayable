var CURRENT = null;
var STATE = null;

var UI = {

	updateCurrent: function() {
		$('#current-name').text(CURRENT.name);
		$('#current-artist').text(CURRENT.artist);
		$('#current-artwork').css('background-image', 'url("'+CURRENT.artwork+'")');
		$('#art').css('background-image', 'url("'+CURRENT.artwork+'")');
	},

	updateState: function() {
		$('#volume').val(STATE.volume);
		$('#control-main').attr('class', ({
			"-1": 'fa fa-stopped',
			"0": 'fa fa-play',
			"1": 'fa fa-pause'
		}[STATE.state]));
	}

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

socket.on('connect', function() {
	console.log('CONNECTION OK');
	$('#no-connection-banner').removeClass('visible');
});

socket.on('disconnect', function() {
	console.error('CONNECTION DOWN');
	$('#no-connection-banner').addClass('visible');
});


///////////////
// Listeners //
///////////////


$('#control-main').click(function() {
	socket.emit('player.playpause');
});

$('#control-prev').click(function() {
	socket.emit('player.previous');
});

$('#control-next').click(function() {
	socket.emit('player.next');
});

$('#volume').change(function() {
	socket.emit('player.volume', {
		value: $(this).val()
	});
});