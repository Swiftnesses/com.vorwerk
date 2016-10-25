/* global Homey */
var WebSocket = require('ws')
exports.init = function () {
  Homey.manager('flow').on('action.clean_house', wakeUp)
  Homey.manager('flow').on('action.clean_house.device.autocomplete', autocompleteDevice)
}

function autocompleteDevice (callback, args) {
  var devices = Homey.manager('settings').get('devices') || []
  callback(null, devices
    .filter((item) => item.name.toLowerCase().includes(args.query.toLowerCase()))
    .sort((a, b) => (a.name > b.name ? 1 : -1)))
}

function wakeUp (callback, args) {
  Homey.log('Waking vacuum: ', { args: args })
  var data = 'clean'
  var ip = 'ws://' + args.device.ip
  var port = '81'
  var url = ip + ':' + port
  var ws = new WebSocket(url)
  Homey.log('Target URL:', url)

  ws.on('open', function () {
    Homey.log('Connected to server')
    ws.send(data)
    Homey.log('  --> WebSocket send action completed')
    Homey.log('  --> Sent data: ' + data)
    callback(null, true)
  })

  ws.on('message', function (message) {
    var response = message
    Homey.log('Response: %s', response)
    if (response.indexOf('clean') > -1) {
      Homey.log('Response: Vacuum is awake')
      checkCharging(callback, args)
    }
  })

  ws.on('error', function (error) {
    Homey.log('  --> WebSocket send action completed')
    Homey.log('  --> Error: %s', error)
    callback(error)
  })
}

function checkCharging (callback, args) {
  Homey.log('Checking charging status: ', { args: args })
  var data = 'GetCharger'
  var ip = 'ws://' + args.device.ip
  var port = '81'
  var url = ip + ':' + port
  var ws = new WebSocket(url)
  Homey.log('Target URL:', url)

  ws.on('open', function () {
    Homey.log('Connected to server')
    ws.send(data)
    Homey.log('  --> WebSocket send action completed')
    Homey.log('  --> Sent data: ' + data)
    callback(null, true)
  })

  ws.on('message', function (message) {
    var response = message
    Homey.log('Response: %s', response)
    if (response.indexOf('lithiumChargeDone,1') > -1) {
      Homey.log('Response: Robot Vacuum is charged, sending clean command.')
      cleanHouse(callback, args)
    }
  })

  ws.on('error', function (error) {
    Homey.log('  --> WebSocket send action completed')
    Homey.log('  --> Error: %s', error)
    callback(error)
  })
}

function cleanHouse (callback, args) {
  Homey.log('Send clean command: ', { args: args })
  var data = 'clean'
  var ip = 'ws://' + args.device.ip
  var port = '81'
  var url = ip + ':' + port
  var ws = new WebSocket(url)
  Homey.log('Target URL:', url)

  ws.on('open', function () {
    Homey.log('Connected to server')
    ws.send(data)
    Homey.log('  --> WebSocket send action completed')
    Homey.log('  --> Sent data: ' + data)
    callback(null, true)
  })

  ws.on('message', function (message) {
    var response = message
    Homey.log('Response: %s', response)
    if (response.indexOf('clean') > -1) {
      Homey.log('Response: Vacuum should be cleaning!')
    }
  })

  ws.on('error', function (error) {
    Homey.log('  --> WebSocket send action completed')
    Homey.log('  --> Error: %s', error)
    callback(error)
  })
}