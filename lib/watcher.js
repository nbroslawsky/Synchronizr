var path = require('path'),
	spawn = require('child_process').spawn;

module.exports = function(directory, onchange) {
	var cmd = 'inotifywait',
		args = [
			'-q',
			'-e','modify',
			'-e','attrib',
			'-e','create',
			'-e','delete',
			'-e','move',
			'--format','"%w%f"',
			'-mr', 
			directory
		],
		inotify = spawn(cmd, args);

	inotify.stdout.on('data', function(data) { onchange(JSON.parse(data)); });
	inotify.stderr.on('data', function(data) {});
	inotify.on('exit', function(data) {
		console.log(data, 'the process exited');
	});
}