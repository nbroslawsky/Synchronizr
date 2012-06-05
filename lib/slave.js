var actor = require('./actor.js'),
	client = require('./transmitters/client.js'),
	fs = require('fs');

var files = {};

module.exports = {
	init : function(config) {

		var fileList;
		for(var name in config.directories) {
			files[name] = this.getFileList(config.directories[name]);
		}
		this.watch(config.directories);

		var self = this;
		var c = client.connect(config.master);
			c.on('server-response', function(data) {
				console.log('slave received data', Object.keys(data));
				for(var name in data) {
					var filename = '/tmp/'+name+"_"+(new Date().valueOf())+".tar.gz";
					fs.writeFile(filename, data[name], function() {
						console.log('here i am');
					});
				}
			});
			c.send({ 'method' : 'connect', 'data' : files });
		

	},

	onchange : function(name, data) {
		console.log('woops. ' + name + ' file changed.', data);
	}

}.extend(actor);
