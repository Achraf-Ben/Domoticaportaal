moduel_id = 1

function lampAan() {
  circle1.style.fill='green'
}

function lampUit() {
  circle1.style.fill="red"
}

function cameraAan() {
  circle2.style.fill='green'
}

function cameraUit() {
  circle2.style.fill="red"
}

function onDeviceReady() {
    var roomId = prompt("Please enter your room ID");
    document.getElementById("title").innerHTML = roomId;
}
