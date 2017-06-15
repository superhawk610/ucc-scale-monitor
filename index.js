// Constants
const webPort = 5000
const socketPort = 5001
const serialPort = '/dev/ttyUSB0'

const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const serial = require('serialport')
const port = new serial(serialPort)

// Serial Port

port.on('open', () => {
  port.write('CP', (err) => {
    if (err) return console.log(err)
    console.log('Continuous printing requested successfully')
  })
})

port.on('data', (data) => {
  io.emit('display', data.split(' ').shift())
})

port.on('error', (err) => {
  console.log('Port error:', err.message)
})

// Web Interface / socket.io

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

io.on('connection', (socket) => {
  console.log('A client connected')
  socket.on('serialconnect', (msg) => {
    console.log('Attempting connection to serial port at', serialPort)
    port.open((err) => {
      if (err) return console.log('Error opening port: ', err)
    })
  })
  socket.on('command', (msg) => {
    console.log('Sending signal to port:', msg)
    port.write(msg)
  })
  socket.on('disconnect', () => {
    console.log('A client disconnected')
  })
})

server.listen(webPort, () => {
  console.log('Server listening at http://localhost:' + webPort)
})

// Display test

// setInterval(() => {
//   io.emit('display', (Math.random() * 1000).toFixed(1) + ' lb')
// }, 1000)
