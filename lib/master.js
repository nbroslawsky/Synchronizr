var actor = require('./actor.js'),
	server = require('./transmitters/server.js');

var files = {};

module.exports = {
	init : function(config) {

		var fileList;
		for(var name in config.directories) {
			files[name] = this.getFileList(config.directories[name]);
		}
		this.watch(config.directories);
		console.log(files);

		var self = this;
		server.init(config.port, function(data, respond) {
			self.handlers[data.method].call(self, data.data, respond)
		});
	},

	onchange : function(name, data) {
		console.log('woops. ' + name + ' file changed.', data);
	},

	handlers : {
		'connect' : function(slaveFiles, respond) {
			console.log(arguments);
		}
	}

}.extend(actor);