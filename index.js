/**
 * For OHAUS scales using a RS-232 -> USB serial converter, the following commands are available:
 * - CP\n - Continuous Print will constantly output the current weight
 * - 0P\n - disable Continuous Print
 *
 * An inherent limitation of `serialport` is that it does not support more than 3 concurrent
 * serial connections. Keep this in mind when planning use cases.
 */

const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const webPort = 5000
const serialPortAddresses = ['/dev/ttyUSB0']

app.use(express.static(path.join(__dirname, 'public')))

const log = (tag, message) => {
  tag = tag.toUpperCase().substring(0, 6)
  const space = '      '.substring(0, 6 - tag.length)
  console.log(`${space}[${tag.substring(0, 6)}] ${message}`)
}

const onOpen = port => () =>
  setTimeout(
    () =>
      port.write('CP\n', err =>
        log(
          err ? 'error' : 'serial',
          err ? err.message : `Continuous printing activated on ${port}`
        )
      ),
    2000
  )

const onData = port => data =>
  data.match(/\s(lb|kg)/) &&
  io.emit('data', {
    port,
    data: data
      .toString()
      .trim()
      .split(' ')
      .slice(0, 2)
      .join(' ')
  })

const onError = port => err => log('serial', `Error on ${port}: ${err.message}`)

const serialPorts = serialPortAddresses.map(address =>
  new SerialPort(address, onError(address)).pipe(
    new Readline({ delimiter: '\n' })
  )
)

serialPorts.forEach(port => {
  port.on('open', onOpen(port))
  port.on('data', onData(port))
})

io.on('connection', socket => {
  log('socket', `A client connected from ${socket.handshake.address}`)
  io.emit('init', serialPortAddresses)
  socket.on('disconnect', () =>
    log('socket', `The client at ${socket.handshake.address} disconnected`)
  )
})

server.listen(webPort, () =>
  log('server', `Server listening at http://localhost:${webPort}`)
)
