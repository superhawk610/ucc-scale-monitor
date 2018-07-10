var socket = io()
var output = document.getElementById('output')

window.onload = function() {
  socket.on('init', function(ports) {
    var outputs = ''

    for (var i = 0; i < Object.keys(ports).length; i++) {
      outputs += `
        <div id="port-${i}" data-port="${Object.keys(ports)[i]}">
          <div class="name">${Object.values(ports)[i]}</div>
          <div class="data"></div>
        </div>
      `
    }

    output.innerHTML = outputs
  })

  socket.on('data', function(data) {
    var port = data.port
    var data = data.data

    document.querySelector(`div[data-port="${port}"] .data`).innerHTML = data
  })
}
