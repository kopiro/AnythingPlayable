exports.__NAME__ = "Spotify";

var spotify = require('spotify-node-applescript');
var fs = require('fs');
var request = require('request');
var _ = require('underscore');

var TRACK_CACHE = {};

exports.isRunning = function(callback) {
	spotify.isRunning(function(err, result){
		if (err) {
			console.error(exports.__NAME__, err);
			if (callback) callback(false);
			return;
		}

		if (callback) callback(result);
	});
};

exports.getCurrent = function(callback) {
	spotify.getTrack(function(err, result){
		if (err) {
			console.error(exports.__NAME__, err);
			if (callback) callback(null);
			return;
		}

		if (result.id == null) {
			console.error(exports.__NAME__, "Result null");
			if (callback) callback(null);
			return;
		}

		var id = result.id.replace('spotify:track:', '');
		var track = {
			id: id,
			name: result.name,
			artist: result.artist,
			album: result.album,
			duration: result.duration,
			artwork: '/public/artwork-default.png'
		};

		if (TRACK_CACHE[id]) {
			_.extend(track, TRACK_CACHE[id]);
			if (callback) callback(track);
		} else {

			request('http://api.spotify.com/v1/tracks/' + id, function(err, response, online_track) {
				try {
					online_track = JSON.parse(online_track);
					TRACK_CACHE[id] = {
						artwork: online_track.album.images[0].url
					};
					 _.extend(track, TRACK_CACHE[id]);
				} catch (ex) {}

				if (callback) callback(track);
			});

		}
	});
};

exports.getState = function(callback) {
	spotify.getState(function(err, state) {
		if (err) {
			console.error(exports.__NAME__, err);
			if (callback) callback(null);
			return;
		}

		if (callback) callback({
			state: ({stopped:-1,paused:0,playing:1})[state.state],
			volume: state.volume,
			track_id: state.track_id
		});
	});

};

exports.playPause = function(callback) {
	spotify.playPause(function(err, result) {
		if (err) {
			console.error(exports.__NAME__, err);
			if (callback) callback(null);
			return;
		}

		if (callback) callback(result);
	});
};

exports.pause = function(callback) {
	spotify.pause(function(err, result) {
		if (err) {
			console.error(exports.__NAME__, err);
			if (callback) callback(null);
			return;
		}

		if (callback) callback(result);
	});
};

exports.play = function(callback) {
	spotify.play(function(err, result) {
		if (err) {
			console.error(exports.__NAME__, err);
			if (callback) callback(null);
			return;
		}

		if (callback) callback(result);
	});
};

exports.previous = function(callback) {
	spotify.previous(function(err, result) {
		if (err) {
			console.error(exports.__NAME__, err);
			if (callback) callback(null);
			return;
		}

		if (callback) callback(result);
	});
};

exports.next = function(callback) {
	spotify.next(function(err, result) {
		if (err) {
			console.error(exports.__NAME__, err);
			if (callback) callback(null);
			return;
		}

		if (callback) callback(result);
	});
};

exports.setVolume = function(value, callback) {
	spotify.setVolume(value, function(err, result) {
		if (err) {
			console.error(exports.__NAME__, err);
			if (callback) callback(null);
			return;
		}

		if (callback) callback(result);
	});
};
