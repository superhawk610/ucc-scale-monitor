var socket = io()
var output = document.getElementById('output')
var ports = []

window.onload = function() {
  socket.on('init', function(_ports) {
    ports = _ports
    var outputs = ''

    for (var i = 0; i < ports.length; i++) {
      outputs += `
        <div id="port-${i}">
          <div class="name">${ports[i]}</div>
          <div class="data"></div>
        </div>
      `
    }

    output.innerHTML = outputs
  })

  socket.on('data', function(data) {
    var port = data.port
    var portIndex = ports.indexOf(port)
    var data = data.data

    document.querySelector(`#port-${portIndex} .data`).innerText(data)
  })
}
