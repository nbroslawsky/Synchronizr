var spawn = require('child_process').spawn,
	exec = require('child_process').exec,
	async = require('async'),
	fs = require('fs'),
	path = require('path');



module.exports = {
	create : function(archiveName, baseDir, files, callback) {

		var ps = spawn('tar',[
			'--create',
			'--directory', baseDir,
			'--gzip',
			'--file', archiveName
		].concat(files));

		ps.on('exit', function(code) {
			if(code !== 0) {
				console.log("There was an error creating " + archiveName, code);
			}

			callback(archiveName);
		});

	},

	extract : function(archiveName, baseDir, callback) {
		var ps = spawn('tar',[
			'--extract',
			'--directory', baseDir,
			'--gzip',
			'--file', archiveName
		]);

		var self = this;

		ps.on('exit', function(code) {
			if(code !== 0) {
				console.log("There was an error extracting " + archiveName, code);
			}

			self.list(archiveName, function(files) {

				var getStatFunctions = {};
				files.forEach(function(f) {

					getStatFunctions[f] = function(cb) {

						fs.stat(path.join(baseDir, f), function(err, stats) {
							cb(err, stats);
						});

					};
				});

				async.parallel(getStatFunctions, function(err, fileStats) {
					callback(fileStats);
				})
			})
			
		});
	},

	list : function(archiveName, callback) {

		console.log('archive', archiveName);
		var ps = spawn('tar',[
			'--list',
			'--file', archiveName
		]);

		var data = '';
		ps.stdout.on('data', function(d) { data += d.toString('utf-8'); });
		ps.on('exit', function(code) {
			if(code !== 0) {
				console.log("There was an error listing " + archiveName);
			}

			callback(data.split('\n').filter(function(v) { return !!v; }))
		});
	}
};