var socket=io();$(function(){$(".control-1").on("click",function(){socket.emit("serialconnect","")}),$(".control-2").on("click",function(){close()}),$(".control-3").on("click",function(){socket.emit("command","Z")}),socket.on("display",function(o){$("#output").text(o)}),$("body").hover(function(){$(".control").fadeIn(500)},function(){$(".control").fadeOut(500)})});