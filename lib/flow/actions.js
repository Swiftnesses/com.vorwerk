/* global Homey */
var WebSocket = require('ws')
exports.init = function() {
	Homey.manager('flow').on('action.clean_house', cleanHouse)
}

function cleanHouse(callback, args) {
	Homey.log('cleanHouse', {
			args: args
		})
		// var url = args.url
		// var data = args.data
	var rawurl = 'ws://192.168.1.111'
	var port = '81'
	var url = url + ':' + port
	var data = 'clean'
	try {
		var ws = new WebSocket(url)
		Homey.log(ws)
	} catch (error) {
		return callback(error)
	}
	ws.on('open', function() {
		ws.send(data, function() {
			ws.close()
			Homey.log('  --> webSocket Send action completed')
			callback(null, true)
		})
	}).on('error', function(error) {
		Homey.log('  --> webSocket Send action failed', error)
		callback(error)
	})
}