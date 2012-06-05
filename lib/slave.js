var actor = require('./actor.js'),
	client = require('./transmitters/client.js');

var files = {};

module.exports = {
	init : function(config) {

		var fileList;
		for(var name in config.directories) {
			files[name] = this.getFileList(config.directories[name]);
		}
		this.watch(config.directories);
		console.log(files);

		this.initServer();
		var self = this;

		var c = client.connect(master);
		c.send({ 'method' : 'connect', 'data' : files });
		c.on('data', function(data) {
			console.log('slave received data', data);
		});
		

	},

	onchange : function(name, data) {
		console.log('woops. ' + name + ' file changed.', data);
	},

	callHome : function(master, cb) {
		var parts = master.split(':'),
			host = parts[0],
			port = parts[1];

		var self = this;

		var client = net.connect(port, host, cb);
			client.st
	}
}.extend(actor);