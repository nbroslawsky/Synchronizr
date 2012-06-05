var net = require('net'),
	fs = require('fs'),
	path = require('path'),
	spawn = require('child_process').spawn;


var directory = '/home/nbroslawsky/test',
	cmd = 'inotifywait',
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


inotify.stdout.on('data', function(data) {
	console.log(JSON.parse(data));
});

inotify.stderr.on('data', function(data) {});

inotify.on('exit', function(data) {
	console.log(data, 'the process exited');
});

/*
fs.watch('/home/nbroslawsky/test', function(event, filename) {
	if(filename) {
		console.log(event, 'filename provided: ' + filename);
	} else {
		console.log('filename not provided');
	}
});
*/

/*
function getHandler(directory) {
	return function(e, filename) {
		console.log('directory',directory,', filename',filename);
		var fullPath = path.join(directory,filename),
			isDir = fs.statSync(fullPath).isDirectory();

		if(isDir && !directories[fullPath]) {
			console.log("now watching " + fullPath);
			directories[fullPath] = watch(fullPath);
		} else if(!isDir && directories[fullPath]) {
			console.log("directory no longer exists: " + fullPath, Object.keys(directories[fullPath]));
			delete directories[fullPath];
		} else {
			console.log("Don't need to do anything with " + fullPath);
		}
	}
}

var directories = {};
function watch(directory) {

	fs.watch(directory, getHandler(directory));

	var thisPath, files = fs.readdirSync(directory);
	for(var i=0; i<files.length; i++) {
		thisPath = path.join(directory, files[i]);
		if(fs.statSync(thisPath).isDirectory()) {
			console.log(thisPath + " is a directory");
			directories[thisPath] = watch(thisPath);
		}
	}
}

watch('/home/nbroslawsky/test');
*/



/*
var client = net.connect(1337, function() {
	fs.fstat('/home/nbroslawsky/Sublime Text 2/sublime_text_icon_2181.png', function(err, data) {
		if(err) {
			console.log(err);
			return;
		}
		client.write(JSON.stringify(data));
		client.end();
	})
})*/