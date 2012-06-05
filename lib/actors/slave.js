var actor = require('./actor.js'),
	client = require('../transmitters/client.js'),
	fs = require('fs');

var files = {};

function getExtractFunction(name) {
	return function(err) {
		//extract file
		console.log('here i am', name, err);
	};
}

var c = null;

module.exports = {

	handlers : require('./actions/slave.js'),
	init : function(config) {

		var fileList;
		for(var name in config.directories) {
			files[name] = this.getFileList(config.directories[name]);
		}
		this.watch(config.directories);

		var self = this;
		c = client.connect(config.master);
		c.on('server-response', function(data) {
			self.handlers[data.method].call(self, data.data, respond);
		});
		c.send({ 'method' : 'connect', 'data' : files });
	},

	onchange : function(name, data) {
		console.log('woops. ' + name + ' file changed.', data);
	}

}.extend(actor);
