const log = require('./log')
const socket = require('socket.io')

let io

const reflectArray = arr =>
  arr.reduce((obj, val) => {
    obj[val] = val
    return obj
  }, {})

module.exports = {
  emit: (tag, data) => io.emit(tag, data),
  init(server, serialPortAddresses) {
    io = socket(server)
    io.on('connection', socket => {
      log('socket', `A client connected from ${socket.handshake.address}`)
      socket.emit(
        'init',
        Array.isArray(serialPortAddresses)
          ? reflectArray(serialPortAddresses)
          : serialPortAddresses
      )
      socket.on('disconnect', () =>
        log('socket', `The client at ${socket.handshake.address} disconnected`)
      )
    })
  }
}
