var net = require('net'),
	config = require('./config.json');

console.log(config);
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