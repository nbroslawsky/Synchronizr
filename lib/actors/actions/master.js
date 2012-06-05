/* these are executed in the context of the actor (master or slave) */

module.exports = {
	'connect' : function(slaveFiles, respond) {
		var todos = {}, needs = {};
		for(var n in slaveFiles) {
			if(files[n]) {
				todos[n] = this.diff(slaveFiles[n], files[n]);
				needs[n] = todos[n].need;
			}
		}

		// console.log(todos);
		var tars = [];
		for(n in todos) {
			tars.push(this.getArchiverFunction(n, todos[n].have));
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
		var extractorOps = [];
		for(var n in files) {
			extractorOps.push(this.getWriteArchiveFunction(n, files[n]));
		}

		async.parallel(extractorOps, function(err, results) {
			respond({ method : 'syncfinished', data : true });
		});
	}
};