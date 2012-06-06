Synchronizr
===========

A node.js utility for getting dropbox-like functionality on my home (Linux) network

So, here's the thing. Between my 3 Ubuntu machines at home, I've got videos, music, pictures, and documents that I want to have on all my computers without a) investing in a NAS, b) paying far too much money for more Dropbox space, and c) having a Google Drive linux client. I had been using unison to do this tri-directional sync across my network, but that's cumbersome and takes too much time. So, I decided to write my own node.js daemon to do it for me.

First of all, you'll want to put a config.json file in the root of this project. I'll fix that later, but here's the gist of it:

For the master box:
```json
{
	"port" : 1337,
	"directories" : {
		"test" : "/home/nbroslawsky/test"
	}
}
```

For the slave boxes:
```json
{
	"master" : "mymasterserver.local:1337",
	"directories" : {
		"test" : "/home/nbroslawsky/test"
	}
}
```

The application will start in either 'master' or 'slave' mode, depending on this configuration.