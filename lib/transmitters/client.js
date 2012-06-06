var net = require('net'),
	events = require('events');

var reconnectCounter = 0;
var maxReconnectTries = 10;
var client;


module.exports = {

	connect : function(server) {
		events.EventEmitter.call(this);
		client = this._init(server);

		return this;
	},

	send : function(data, callback) {
		client.write(this.transmitify(data));
	},

	_init : function (server) {
		var parts = server.split(':'),
			host = parts[0],
			port = parts[1];

		var client = net.connect(port, host, function() { /* upon connection...  */ });
		this._registerEnd(client, server);
		this._registerData(client);

		return client;
	},

	_registerEnd : function (client, server) {
		var self = this;
		client.on('end', function() {
			if(self.reconnectCounter++ < self.maxReconnectTries) {
				self.client = self.init(server);
			} else {
				console.log('Failed to connect to ' + master);
				self.client = null;
			}
		});
	},

	_registerData : function (client) {
		var self = this;
		var data = '';

		client.on('data', function(d) {
			self.reconnectCounter = 0;
			data += d.toString('utf-8');

			var results = self.parseStream(data);
			data = results.str;
			var obj = results.obj;

			if(obj !== undefined) {
				self.emit('data', obj);
			}
		});
	}

}.extend(events.EventEmitter.prototype).extend(require('./common.js'));
