/**
 * For OHAUS scales using a RS-232 -> USB serial converter, the following commands are available:
 * - CP\n - Continuous Print will constantly output the current weight
 * - 0P\n - disable Continuous Print
 *
 * An inherent limitation of `serialport` is that it does not support more than 3 concurrent
 * serial connections. Keep this in mind when planning use cases.
 */

const opts = require('opts')
const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const log = require('./lib/log')

const options = [
  {
    short: 'm',
    long: 'mock',
    description:
      'Ignore real serial ports and mock input data for 3 serial inputs.'
  }
]
opts.parse(options, true)

const serial = require('./lib/serial')
const socket = require('./lib/socket')

const webPort = 5000
// const serialPortAddresses = {
//   '/dev/ttyUSBTopLeft': 'topLeft',
//   '/dev/ttyUSBBottomLeft': 'bottomLeft',
//   '/dev/ttyUSBBottomRight': 'bottomRight'
// }
const serialPortAddresses = ['/dev/ttyUSB0']

socket.init(server, serialPortAddresses)
if (opts.get('mock')) serial.mock(serialPortAddresses)
else serial.init(serialPortAddresses)

app.use(express.static(path.join(__dirname, 'public')))

server.listen(webPort, () =>
  log('server', `Server listening at http://localhost:${webPort}`)
)
