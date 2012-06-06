var async = require('async');
/* these are executed in the context of the actor (master or slave) */

module.exports = {
	'connect' : function(slaveFiles, respond) {
		var todos = {}, needs = {};
		for(var n in slaveFiles) {
			if(this.files[n]) {
				todos[n] = this.diff(slaveFiles[n], this.files[n]);
				needs[n] = todos[n].need;
			}
		}

		if(!todos.need && !todos.have) {
			respond({
				method : 'initialsync',
				data : false
			});
			return;
		}

		var tars = [];
		for(var t in todos) {
			tars.push(this.getArchiverFunction(t, todos[t].have));
		}

		async.parallel(tars, function(err, results) {
			var o = {};
			results.forEach(function(val) {
				o.extend(val);
			});

			respond({
				method : 'initialsync',
				data : { files : o, need : needs }
			});
		});
	},

	initialsync : function(files, respond) {

		if(files === null) {
			respond({ method : 'syncfinished', data : true });
			return;
		}

		var extractorOps = [];
		for(var n in files) {
			extractorOps.push(this.getWriteArchiveFunction(n, files[n]));
		}

		async.parallel(extractorOps, function(err, results) {
			console.log('finished extracting');
			respond({ method : 'syncfinished', data : true });
		});
	}
};