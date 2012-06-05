module.exports = function(archiveName, baseDir, files, callback) {

	var filename = this.getArchiveFileName(archiveName);
	var ps = spawn('tar',[
		'--create',
		'--directory', baseDir,
		'--gzip',
		'--file', filename
	].concat(files);

	ps.on('exit', function(code) {
		if(code !== 0) {
			console.log("There was an error creating " + archiveName);
		}

		callback(archiveName);
	});

}