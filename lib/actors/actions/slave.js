module.exports = {
	initialsync : function(data) {
		console.log('slave received data', Object.keys(data));


		var archive = function(cb) {
			var need = data.need;
			var archiverOps = [];
			for(var n in need) {
				archiverOps.push(this.getArchiverFunction(n, need[n]));
			}

			async.parallel(archiverOps, function(err, results) {
				var o = {};
				results.forEach(function(val) {
					o.extend(val);
				});

				cb(null, o);
			});
		};

		var extract = function(cb) {
			var extractorOps = [];
			var files = data.files;
			for(var n in files) {
				extractorOps.push(this.getWriteArchiveFunction(n, files[n]));
			}

			async.parallel(extractorOps, function(err, results) {
				cb(null, null);
			});
		}

		async.parallel[archive,extract], function(err, results) {
			var o = {};
			results.forEach(function(val) {
				if(val) { o.extend(val); }
			});

			c.send({ method : 'initialsync', 'data' : o});
		}
	}
}