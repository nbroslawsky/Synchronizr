var actor = require('./actor.js'),
	client = require('../transmitters/client.js'),
	fs = require('fs');

var files = {};

function getExtractFunction(name) {
	return function(err) {
		//extract file
	};
}

module.exports = {

	client : null,
	handlers : require('./actions/slave.js'),
	init : function(config) {

		var fileList;
		for(var name in config.directories) {
			files[name] = this.getFileList(config.directories[name]);
		}
		this.watch(config.directories);

		var self = this;
		this.client = client.connect(config.master);
		this.client.on('data', function(data) {
			self.handlers[data.method].call(self, data.data);
		});
		this.client.send({ 'method' : 'connect', 'data' : files });
	},

	onchange : function(name, data) {
		console.log('woops. ' + name + ' file changed.', data);
	}

}.extend(actor);
