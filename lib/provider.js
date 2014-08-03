var _ = require('underscore');
var fs = require('fs');

function ServiceProvider(provider) {
	var self = this;
	self._provider = null;

	if (_.isString(provider)) {
		self._provider = require('../providers/'+provider);
	} else {
		self._provider = provider;
	}

	if (null===self._provider) {
		throw new Error("Set a provider");
	}

	console.log("Provider is "+self._provider.__NAME__);

	self.isRunning = function(callback) {
		self._provider.isRunning(callback);
	};

	self.getCurrentArtwork = function(callback) {
		self._provider.getCurrentArtwork(callback);
	};

	self.getCurrent = function(callback) {
		self._provider.getCurrent(function(err, now) {
			if (err) return callback(err);

			now.artwork = '/current/artwork?id=' + now._id;
			callback(null, now);
		});
	};

	self.getState = function(callback) {
		self._provider.getState(callback);
	};

	self.playPause = function(callback) {
		self._provider.playPause(callback);
	};

	self.pause = function(callback) {
		self._provider.pause(callback);
	};

	self.play = function(callback) {
		self._provider.play(callback);
	};

	self.next = function(callback) {
		self._provider.next(callback);
	};

	self.previous = function(callback) {
		self._provider.previous(callback);
	};

}

module.exports = ServiceProvider;