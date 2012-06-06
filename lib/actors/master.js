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
				mCounter++;
			} else if(mCounter >= myKeys.length || myKeys[mCounter] > theirKeys[tCounter]) {
				todos.need.push(theirKeys[tCounter]);
				tCounter++;
			} else if (myKeys[mCounter] == theirKeys[tCounter]) {
				if(mine[myKeys[mCounter]] < theirs[theirKeys[tCounter]]) {
					todos.need.push(theirKeys[tCounter]);
				} else if (mine[myKeys[mCounter]] > theirs[theirKeys[tCounter]]) {
					todos.have.push(myKeys[mCounter]);
				}
				tCounter++;
				mCounter++;
			}

		}

		return todos;
	}

}.extend(actor);