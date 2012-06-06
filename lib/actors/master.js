var actor = require('./actor.js'),
	server = require('../transmitters/server.js'),
	path = require('path'),
	fs = require('fs');

module.exports = {
	files : {},
	config : null,
	handlers : require('./actions/master.js'),

	init : function(conf) {

		var config = this.config = conf;

		var fileList;
		for(var name in config.directories) {
			this.files[name] = this.getFileList(config.directories[name]);
		}

		this.watch(config.directories);

		var self = this;
		server.init(config.port, function(data, respond) {
			self.handlers[data.method].call(self, data.data, respond);
		});
	},

	onchange : function(name, data) {
		console.log('woops. ' + name + ' file changed.', data);
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