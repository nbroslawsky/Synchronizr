var spawn = require('child_process').spawn;

module.exports = function(archiveName, baseDir, files, callback) {

	var ps = spawn('tar',[
		'--create',
		'--directory', baseDir,
		'--gzip',
		'--file', archiveName
	].concat(files));

	ps.on('exit', function(code) {
		if(code !== 0) {
			console.log("There was an error creating " + archiveName);
		}

		callback(archiveName);
	});

}