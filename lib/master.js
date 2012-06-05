var actor = require('./actor.js');

var files = {};

module.exports = {
	init : function(config) {

		var fileList;
		for(var name in config.directories) {
			files[name] = this.getFileList(config.directories[name]);
		}
		this.watch(config.directories);
		this.initServer();
		console.log(files);
	},
	
	onchange : function(name, data) {
		console.log('woops. ' + name + ' file changed.', data);
	},

	handlers : {
		'connect' : function() {
			console.log(arguments);
		}
	}
}.extend(actor);