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
  },
  {
    short: 's',
    long: 'socket-only',
    description:
      "Set up the serial/socket relay only, don't serve the dashboard"
  }
]
opts.parse(options, true)

const serial = require('./lib/serial')
const socket = require('./lib/socket')

/**
 * Configure the serial ports you would like to listen on below. You may either provide
 * an array of ports, or an Object that maps port location (key) to name (value), as
 * shown below:
 *
 * const serialPortAddresses = [
 *   '/dev/ttyUSB0'
 * ]
 *
 * = OR =
 *
 * const serialPortAddresses = {
 *   '/dev/ttyUSBTopLeft': 'topLeft',
 *   '/dev/ttyUSBBottomLeft': 'bottomLeft',
 *   '/dev/ttyUSBBottomRight': 'bottomRight'
 * }
 *
 * If you need to select ports based on their physical location on the device/PCI controller,
 * use a custom udev rule similar to the following:
 *
 *   #/etc/udev/rules.d/81-usblocation.rules
 *   SUBSYSTEM=="tty", ATTRS{idVendor}=="xxxx", ATTRS{idProduct}=="xxxx", ENV{ID_PATH}=="pci....0:1:0", SYMLINK+="ttyUSBTopLeft"
 *   SUBSYSTEM=="tty", ATTRS{idVendor}=="xxxx", ATTRS{idProduct}=="xxxx", ENV{ID_PATH}=="pci....0:2:0", SYMLINK+="ttyUSBBottomLeft"
 *
 * To find the correct values for idVendor, idProduct, and ID_PATH, use the following command:
 *
 *   udevadm info -a -n /dev/ttyUSB0
 *
 * To use this port without running as the root user, add your Node user to the `dialout` group:
 *
 *   sudo usermod -a -G dialout $USER
 */
const serialPortAddresses = ['/dev/ttyUSB0']
const webPort = 5000

socket.init(server, serialPortAddresses)
if (opts.get('mock')) serial.mock(serialPortAddresses)
else serial.init(serialPortAddresses)

if (!opts.get('socket-only'))
  app.use(express.static(path.join(__dirname, 'public')))

server.listen(
  webPort,
  () =>
    opts.get('socket-only')
      ? log('socket', `Socket listening at http://localhost:${webPort}`)
      : log('server', `Server listening at http://localhost:${webPort}`)
)
