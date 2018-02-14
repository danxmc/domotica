// Make connection
let socket = io.connect(window.location.hostname + ':' + 80);

// Emit events
$(".lightBtn").on('click', (e) => {
    e.preventDefault;
    let btn = event.target.id;
    console.log("boton: ", btn);
    let status;
    // Check if button is currently active
    $('#' + btn).attr('aria-pressed') != 'true' ? status = true : status = false;
    console.log('Button status:', status);
    // Emit event to server with the according status
    socket.emit('toggleLight', {
        status: status,
        btnNum: btn
    });
});
/*
$('#lightBtn').on('click', (e) => {
    e.preventDefault;
    let status;
    // Check if button is currently active
    $('#lightBtn').attr('aria-pressed') != 'true' ? status = true : status = false;
    console.log('Button status:', status);
    // Emit event to server with the according status
    socket.emit('toggleLight', {
        status: status
    });
});
*/

// Listen for events
socket.on('toggleBtn', (data) => {
    console.log('listener status:', data.status);
    console.log('listener btn:', data.btnNum);
    if (data.status == true) {
        $('#' + data.btnNum).attr('aria-pressed', 'true');
        $('#' + data.btnNum).addClass('active');
    } else {
        $('#' + data.btnNum).attr('aria-pressed', 'false');
        $('#' + data.btnNum).removeClass('active');
    }
});
