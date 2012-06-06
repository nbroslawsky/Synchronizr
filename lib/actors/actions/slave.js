var async = require('async');

function getAsyncGroups(data) {
	var self = this;
	return {
		archive : function(cb) {
			var need = (data || {}).need;
			if(!need || !need.length) {
				cb(null, null);
				return;
			}

			var archiverOps = [];
			for(var n in need) {
				archiverOps.push(self.getArchiverFunction(n, need[n]));
			}

			async.parallel(archiverOps, function(err, results) {
				var o = {};
				results.forEach(function(val) {
					o.extend(val);
				});

				cb(null, o);
			});
		},
		extract : function(cb) {

			var files = (data || {}).files;
			if(!files || !files.length) {
				cb(null, null);
				return;
			}

			var extractorOps = [];
			
			for(var n in files) {
				extractorOps.push(self.getWriteArchiveFunction(n, files[n]));
			}

			async.parallel(extractorOps, function(err, results) {
				cb(null, null);
			});
		}
	}
}

module.exports = {
	initialsync : function(data) {

		var self = this;
		var groups = getAsyncGroups.call(this, data);
		async.parallel(groups, function(err, results) {
			self.client.send({ method : 'initialsync', 'data' : results.archive});
		});
	},
	syncfinished : function(data) {
		console.log('sync finished');
	}
}