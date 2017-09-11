var socket = io()

$(function() {
  // Connect
  $('.control-1').on('click', function() {
    socket.emit('serialconnect', '')
  })

  // Close
  $('.control-2').on('click', function() {
    socket.emit('pause', '')
  })

  // Zero
  $('.control-3').on('click', function() {
    socket.emit('command', 'Z')
  })

  socket.on('display', function(msg) {
    $('#output').text(msg)
  })

  $('body').hover(function() {
    // show controls
    $('.control').fadeIn(500)
  }, function() {
    // hide controls
    $('.control').fadeOut(500)
  })
})
