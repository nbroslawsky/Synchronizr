var net = require('net');

function TCPClient(server) {
	this.reconnectCounter = 0;
	this.maxReconnectTries = 10;
	this.client = this.init(server);
}

TCPClient.prototype = new require('events').EventEmitter;

TCPClient.prototype.extend(require('./common.js'));
TCPClient.prototype.init = function(server) {
	var parts = server.split(':'),
		host = parts[0],
		port = parts[1];

	var client = net.connect(port, host, function() { /* upon connection...  */ });
	this._registerEnd(client);
	this._registerData(client);

	this.send = function(data) {
		client.write(this.transmitify(data));
	}

	var self = this;

	return client;
};

TCPClient.prototype._registerEnd = function(client) {
	var self = this;
	client.on('end', function() {
		if(self.reconnectCounter++ < self.maxReconnectTries) {
			self.client = self.init(server);
		} else {
			console.log('Failed to connect to ' + master);
			self.client = null;
		}
	});
};

TCPClient.prototype._registerData = function(client) {
	var self = this;
	var data = '';

	client.on('data', function() {
		self.reconnectCounter = 0;
		data += d;

		var results = self.parseStream(data);
		data = results.str;
		var obj = results.obj;

		if(obj !== undefined) {
			self.emit('data', obj);
		}
	};
};

module.exports = {

	connect : function(server) {
		return new TCPClient(server);
	}
};