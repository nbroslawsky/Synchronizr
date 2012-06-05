var net = require('net'),
	utils = require('./lib/utils.js'),
	config = require('./config.json');


var actor = (config.master) 
	? require('./lib/slave.js') 
	: require('./lib/master.js');

actor.init(config);


/*
net.createServer(function(socket) {
	socket.name = socket.remoteAddress + ":" + socket.remotePort;

	socket.write("Hello " + socket.name + ". Welcome.");

	var data = [];
	
	socket.on('data', function(d) { data.push(d); });

	socket.on('end', function() {
		var result,
			s = data.join('');
		try {
			result = JSON.parse(s) || null;
		} catch(e) {
			result = s;
		}

		if(result) {
			console.log(result);
		}
	});
}).listen(config.port || 1337);*/