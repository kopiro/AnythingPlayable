var _ = require('underscore');

exports.set = function set(name) {
	console.log('Setting provider to ' + name);
	_.each(require('../providers/' + name), function(value, key) {
		exports[key] = value;
	});
	return exports;
};
