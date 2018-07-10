const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const io = require('./socket')
const log = require('./log')

const randomFloat = (min, max, float) =>
  (Math.random() * (max - min) + min).toFixed(float)

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
    ),
  onData = port => data =>
    data.match(/\s(lb|kg)/) &&
    io.emit('data', {
      port,
      data: data
        .toString()
        .trim()
        .split(' ')
        .slice(0, 2)
        .join(' ')
    }),
  onError = port => err => log('serial', `Error on ${port}: ${err.message}`),
  mockData = port => {
    io.emit('data', { port, data: `${randomFloat(0, 1000, 2)} lbs` })
    setTimeout(() => mockData(port), 1000)
  }

module.exports = {
  mock(serialPortAddresses) {
    if (Array.isArray(serialPortAddresses))
      serialPortAddresses.forEach(mockData)
    else Object.keys(serialPortAddresses).forEach(mockData)
  },

  init(serialPortAddresses) {
    if (!Array.isArray(serialPortAddresses))
      serialPortAddresses = Object.keys(serialPortAddresses)
    serialPortAddresses
      .map(address =>
        new SerialPort(address, onError(address)).pipe(
          new Readline({ delimiter: '\n' })
        )
      )
      .forEach(port => {
        port.on('open', onOpen(port))
        port.on('data', onData(port))
      })
  }
}
