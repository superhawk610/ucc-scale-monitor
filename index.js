// Constants

const webPort = 5000
const socketPort = 5000
const serialPort = '/dev/ttyUSB0'

const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const serial = require('serialport')
const port = new serial(serialPort, {
  parser: serial.parsers.readline('\n')
})

app.use(bodyParser.urlencoded({ extended: false }))

// Serial Port

port.on('open', () => {
  setTimeout(() => {
    port.write('CP\n', (err) => {
      if (err) return console.log(err)
      console.log('Continuous printing requested successfully')
    })
  }, 2000)
})

port.on('data', (data) => {
  //console.log(data.toString())
  if(data.match(/\s(lb|kg)/)) {
  //if(data.indexOf(' lb') > -1) {
    io.emit('display', data.toString().trim().split(' ').slice(0, 2).join(' '))
  }
})

port.on('error', (err) => {
  console.log('Port error:', err.message)
})

// Web Interface / socket.io

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/black', (req, res) => {
  res.sendFile(path.join(__dirname, 'black.html'))
})

app.get('/warehouse', (req, res) => {
  res.sendFile(path.join(__dirname, 'warehouse.html'))
})

app.get('/splash', (req, res) => {
  res.sendFile(path.join(__dirname, 'splash.html'))
})

app.post('/', (req, res) => {
  io.emit('notify', req.body.payload)
  res.sendStatus(200)
})

io.on('connection', (socket) => {
  console.log('A client connected')
  socket.on('serialconnect', (msg) => {
      port.write('CP\n')
    })
  socket.on('pause', (msg) => {
      port.write('0P\n')
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
