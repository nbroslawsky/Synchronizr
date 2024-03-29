var net = require('net'),
	DEFAULT_SERVER_PORT = 1337;

module.exports = {

	init : function(port, handler) {

		var self = this;
		server = net.createServer(function(socket) {

			socket.name = socket.remoteAddress + ":" + socket.remotePort;
			var data = '';
			socket.on('data', function(d) { 
				data += d.toString('utf-8');

				var results = self.parseStream(data);
				data = results.str;
				var obj = results.obj;

				if(obj !== undefined) {
					handler(obj, self._getResponder(socket));
				}
			});
			socket.on('end', function() {
				console.log('connection was terminated');
			});
		}).listen(port || DEFAULT_SERVER_PORT);
	},

	_getResponder : function(socket) {

		var self = this;
		return function(data) {
			socket.write(self.transmitify(data));
		}

	}
}.extend(require('./common.js'));