var actor = require('./actor.js'),
	net = require('net');

var files = {};

module.exports = {
	init : function(config) {

		var fileList;
		for(var name in config.directories) {
			files[name] = this.getFileList(config.directories[name]);
		}
		this.watch(config.directories);
		console.log(files);

		this.callHome(config.master);

	},

	onchange : function(name, data) {
		console.log('woops. ' + name + ' file changed.', data);
	},

	callHome : function(master) {
		var parts = master.split(':'),
			host = parts[0],
			port = parts[1];

		var client = net.connect(port, host, function() {
			console.log('slave connected');
			client.write(JSON.stringify({
				'method' : 'connect',
				'data' : files
			}));
			client.end();
		})
	}
}.extend(actor);