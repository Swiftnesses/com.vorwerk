/* global Homey */
var WebSocket = require('ws')
exports.init = function () {
  Homey.manager('flow').on('action.clean_house', cleanHouse)
  Homey.manager('flow').on('action.clean_house.device.autocomplete', autocompleteDevice)
}

function autocompleteDevice (callback, args) {
  var devices = Homey.manager('settings').get('devices') || []
  callback(null, devices
    .filter((item) => item.name.toLowerCase().includes(args.query.toLowerCase()))
    .sort((a, b) => (a.name > b.name ? 1 : -1)))
}

function cleanHouse (callback, args) {
  Homey.log('cleanHouse', {
    args: args
  })
  var data = 'clean house'
  var ip = 'ws://' + args.device.ip
  var port = '81'
  var url = ip + ':' + port
  Homey.log('Target URL:', url)
  try {
    var ws = new WebSocket(url)
  } catch (error) {
    return callback(error)
  }
  ws.on('open', function () {
    ws.send(data, function () {
      ws.close()
      Homey.log('  --> webSocket send action completed')
      callback(null, true)
    })
  }).on('error', function (error) {
    Homey.log('  --> webSocket Send action failed', error)
    callback(error)
  })
}