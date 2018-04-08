function setupStream() {
    console.log("setup");
    let video = document.getElementById("video");
    let canvas = document.getElementById("preview");
    let context = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    context.width = canvas.width;
    context.height = canvas.height;

    navigator.getUserMedia = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    if (navigator.getUserMedia) {
        navigator.getUserMedia({ video: true }, loadCam, loadCamFail);
    }

    setInterval(() => {
        viewVideo(video, context, canvas);
    }, 1000);
}

function loadCam(stream) {
    try {
        video.srcObject = stream;
    } catch (error) {
        video.src = window.URL.createObjectURL(stream);
    }
}

function loadCamFail() {
    console.log("Camera not connected");
}

function viewVideo(video, context, canvas) {
    context.drawImage(video, 0, 0, context.width, context.height);
    socket.emit("stream", canvas.toDataURL("image/webp"));
}