var fs = require('fs'),
	path = require('path'),
	watch = require('./watcher.js'),
	net = require('net');

module.exports = {

	'watch' : function(directories) {
		var self = this;
		for(var name in directories) {
			watch(directories[name], (function(n) {
				return function(data) { 
					self.onchange(n, data); 
				};
			})(name));
		}
	},

	'getFileList' : function(directory) {

		var list = {}, dirLength = directory.length;
		function traverse(dir) {
			var stat, fullPath, basePath;
			var files = fs.readdirSync(dir);
			for(var i=0; i<files.length; i++) {
				fullPath = path.join(dir, files[i]);
				stat = fs.statSync(fullPath);
				list[fullPath.substr(dirLength)] = stat.mtime;
				if(stat.isDirectory()) {
					traverse(fullPath);
				}
			}
		}

		traverse(directory);
		return list;
	},

	'createTar' : function(fileList) {
		
	}

}