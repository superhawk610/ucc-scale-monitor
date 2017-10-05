var socket = io()

window.onload = function () {

  socket.on('display', function (msg) {
    $('#output').text(msg)
  })

  socket.on('notify', function (msg) {
    $('#notify').text(msg)
  })

}
