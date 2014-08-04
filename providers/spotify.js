/**
 * Spotify Provider in Applescript
 */

 exports.__NAME__ = "Spotify";

 var SNA = require('spotify-node-applescript');

 exports.isRunning = function(callback) {
 	SNA.isRunning(function(err, state){
 		if (err) return callback(null, false);

 		callback(null, state);

 	});
 };

 exports.getCurrentID = function(callback) {
 	SNA.getTrack(function(err, track){
 		if (err) return callback(err);
 		callback(null, track.id);
 	});
 };

 exports.getCurrentArtwork = function(callback) {
 	exports.getCurrentID(function(err, id) {
 		var fs = require('fs');
 		var artworkPath = __CACHE__+'/artwork-'+id+'.jpg';

 		if (fs.existsSync(artworkPath)) {
 			return callback(null, artworkPath);
 		}

 		var tiffPath = artworkPath.replace('.jpg', '.tiff');
 		var fd = fs.openSync(tiffPath, 'w');

 		SNA.getArtwork(function(err, tiffData) {
 			if (err || !tiffData || !tiffData.length) {
 				return callback("No TIFF data");
 			}

 			if (!fs.writeSync(fd, tiffData, 0, tiffData.length, null)) {
 				return callback("Write error");
 			}

 			require('imagemagick').convert([tiffPath,artworkPath], function(err) {
 				if (err) return callback("Convert failed");

 				fs.closeSync(fd);
 				callback(null, artworkPath);
 			});
 		});

 	});
 };

 exports.getCurrent = function(callback) {
 	SNA.getTrack(function(err, track){
 		if (err) return callback(err, null);

 		callback(null, {
 			_id: track.id,
 			name: track.name,
 			artist: track.artist,
 			album: track.album,
 			duration: track.duration
 		}, track);

 	});
 };

 exports.getState = function(callback) {
 	SNA.getState(function(err, state) {
 		if (err) return callback(err, null);

 		callback(null, {
 			volume: state.volume,
 			state: state.state.toUpperCase(),
 			position: state.position
 		});
 	});

 };

 exports.playPause = function(callback) {
 	SNA.playPause(callback);
 };

 exports.pause = function(callback) {
 	SNA.pause(callback);
 };

 exports.play = function(callback) {
 	SNA.play(callback);
 };

 exports.previous = function(callback) {
 	SNA.previous(callback);
 };

 exports.next = function(callback) {
 	SNA.next(callback);
 };
