module_id = 1

socket = null;

function register_socket(){
  setTimeout(function(){
    socket = io('http://server.zorgtotaal.com', {transports: ['websocket'], path:'/socket.io/socket.io.js'})
  }, 1000)

}

(register_socket)()

function lampAan() {
  circle1.style.fill='green'
  socket.emit('light_on', {id:module_id})
}

function lampUit() {
  circle1.style.fill="red"
  socket.emit('light_off', {id:module_id})
}

function cameraAan() {
  circle2.style.fill='green'
  socket.emit('camera_on', {id:module_id})
}

function cameraUit() {
  circle2.style.fill="red"
  socket.emit('camera_off', {id:module_id} )
}

function onDeviceReady() {
  console.log('hi');

  //var roomId = prompt("Please enter your room ID");
  //document.getElementById("title").innerHTML = roomId;

  connection = server.zorgtotaal.com

  console.log(socket);

}
