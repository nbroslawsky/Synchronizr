var fs = require('fs'),
	path = require('path'),
	watch = require('../watcher.js'),
	net = require('net'),
	config = require('../../config.json'),
	archiver = require('../archiver.js');

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
				list[fullPath.substr(dirLength)] = stat.mtime.valueOf();
				if(stat.isDirectory()) {
					traverse(fullPath);
				}
			}
		}

		traverse(directory);
		return list;
	},

	genArchiveFileName : function(name) {
		var tmpFolder = config.temp || '/tmp/';
		return tmpFolder + name + '_' + (new Date().valueOf()) + '.tar.gz';
	},


	getArchiverFunction : function(name, files) {

		var a = archiver(config.archiver);
		var self = this;

		return function(callback) {

			var archiveName = self.genArchiveFileName(name),
				trimmedFiles = files.map(function(v) {
					return v[0] == '/' ? v.substr(1) : v;
				});

			a.create(archiveName, config.directories[name], trimmedFiles, function(tarFilename) {

				fs.readFile(tarFilename, 'base64', function(err, data) {
					var o = {};
					o[name] = data;
					fs.unlink(tarFilename);
					callback(null, o);
				});
			});
		};
	},

	getWriteArchiveFunction : function(name, fileData) {

		var filename = this.genArchiveFileName(name);
		return function(callback) {
			console.log('writing file', name, filename);
			fs.writeFile(filename, new Buffer(fileData,'base64'), function(err) {
				//do the extraction
				var a = archiver(config.archiver);
				a.extract(filename, config.directories[name], function(stats) {
					console.log('args', stats);
					console.log('time to extract', filename, err);
					callback(null, null);
				});
				

			});
		};
	}

}