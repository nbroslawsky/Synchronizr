var net = require('net'),
	utils = require('./lib/utils.js'),
	config = require('./config.json');

var args = require('optimist').argv;
['master','port'].forEach(function(val) {
	if(args[val]) {
		config[val] = args[val];
	}
})

var actor = (config.master)
	? require('./lib/actors/slave.js')
	: require('./lib/actors/master.js');

actor.init(config);