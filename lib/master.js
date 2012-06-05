var actor = require('./actor.js'),
	server = require('./transmitters/server.js'),
	path = require('path');

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
					// todos[name].have = todos[name].have.map(function(val) {
					// 	return path.join(config.directories[name],val);
					// })
				}
			}

			for(var name in todos) {
				// console.log(todos[name].have);
			}

			// this.createTar(todos.have.map(function() {
			// 	return config.directories
			// }))

		}
	},

	diff : function(theirs, mine) {
		var theirKeys = Object.keys(theirs).sort(),
			myKeys = Object.keys(mine).sort();

		console.log(theirKeys);
		console.log(myKeys);

		var todos = { need : [], have : [] };
		var tCounter = 0, mCounter = 0;
		while(tCounter < theirKeys.length || mCounter < myKeys.length) {

			console.log(tCounter, mCounter);

			if(tCounter >= theirKeys.length || myKeys[mCounter] < theirKeys[tCounter]) {
				todos.have.push(myKeys[mCounter]);
				console.log("I have " + myKeys[mCounter]);
				mCounter++;
			} else if(mCounter >= myKeys.length || myKeys[mCounter] > theirKeys[tCounter]) {
				todos.need.push(theirKeys[tCounter]);
				console.log("They have " + theirKeys[tCounter]);
				tCounter++;
			} else if (myKeys[mCounter] == theirKeys[tCounter]) {
				console.log('ok, so we both have these...', (mine[myKeys[mCounter]] instanceof Date), typeof(theirs[theirKeys[tCounter]]));
				if(mine[myKeys[mCounter]] < theirs[theirKeys[tCounter]]) {
					todos.need.push(theirs[tCounter]);
					console.log("We both have " + theirKeys[tCounter] + ", but theirs is newer");
				} else if (mine[myKeys[mCounter]] > theirs[theirKeys[tCounter]]) {
					todos.have.push(myKeys[mCounter]);
					console.log("We both have " + myKeys[mCounter] + ", but mine is newer");
				}
				tCounter++;
				mCounter++;
			}

		}

		return todos;
	}

}.extend(actor);