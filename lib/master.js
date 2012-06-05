var actor = require('./actor.js'),
	server = require('./transmitters/server.js'),
	path = require('path'),
	async = require('async'),
	fs = require('fs'),
	spawn = require('child_process').spawn;

var files = {},
	config = null;

module.exports = {
	init : function(conf) {

		config = conf;

		var fileList;
		for(var name in config.directories) {
			files[name] = this.getFileList(config.directories[name]);
		}
		this.watch(config.directories);

		var self = this;
		server.init(config.port, function(data, respond) {
			self.handlers[data.method].call(self, data.data, respond)
		});
	},

	onchange : function(name, data) {
		console.log('woops. ' + name + ' file changed.', data);
	},

	handlers : {
		'connect' : function(slaveFiles, respond) {
			var todos = {};
			for(var name in slaveFiles) {
				if(files[name]) {
					todos[name] = this.diff(slaveFiles[name], files[name]);
				}
			}

			// console.log(todos);
			var tars = [];
			for(var name in todos) {
				tars.push(this.getTarFunction(name, todos[name].have));
			}

			async.parallel(tars, function(err, results) {
				var o = {};
				results.forEach(function(val) {
					o.extend(val);
				})

				respond(o);
			});

			// this.createTar(todos.have.map(function() {
			// 	return config.directories
			// }))

		}
	},

	getTarFunction : function(name, files) {

		return function(callback) {

			var filename = '/tmp/'+name+'_'+(new Date().valueOf())+'.tar.gz';
			var ps = spawn('tar',[
				'--create',
				'--directory', config.directories[name],
				'--gzip',
				'--file', filename
			].concat(files.map(function(v) { return v.substr(1); })));

			ps.on('exit', function(code) { 
				if(code != 0) {
					console.log("There was an error creating " + filename);
				}

				fs.readFile(filename, function(err, data) {
					var o = {};
					o[name] = data;
					callback(null, o);
				});
			});			
		}
	},

	diff : function(theirs, mine) {
		var theirKeys = Object.keys(theirs).sort(),
			myKeys = Object.keys(mine).sort();

		var todos = { need : [], have : [] };
		var tCounter = 0, mCounter = 0;
		while(tCounter < theirKeys.length || mCounter < myKeys.length) {

			if(tCounter >= theirKeys.length || myKeys[mCounter] < theirKeys[tCounter]) {
				todos.have.push(myKeys[mCounter]);
				// console.log("I have " + myKeys[mCounter]);
				mCounter++;
			} else if(mCounter >= myKeys.length || myKeys[mCounter] > theirKeys[tCounter]) {
				todos.need.push(theirKeys[tCounter]);
				// console.log("They have " + theirKeys[tCounter]);
				tCounter++;
			} else if (myKeys[mCounter] == theirKeys[tCounter]) {
				// console.log('ok, so we both have these...', (mine[myKeys[mCounter]] instanceof Date), typeof(theirs[theirKeys[tCounter]]));
				if(mine[myKeys[mCounter]] < theirs[theirKeys[tCounter]]) {
					todos.need.push(theirKeys[tCounter]);
					// console.log("We both have " + theirKeys[tCounter] + ", but theirs is newer");
				} else if (mine[myKeys[mCounter]] > theirs[theirKeys[tCounter]]) {
					todos.have.push(myKeys[mCounter]);
					// console.log("We both have " + myKeys[mCounter] + ", but mine is newer");
				}
				tCounter++;
				mCounter++;
			}

		}

		return todos;
	}

}.extend(actor);