// Make connection
let socket = io.connect(window.location.hostname + ':' + 80);

// Emit events
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

// Listen for events
socket.on('toggleBtn', (data) => {
    console.log('listener:', data.status);
    if (data.status == true) {
        $('#lightBtn').attr('aria-pressed', 'true');
        $('#lightBtn').addClass('active');
    } else {
        $('#lightBtn').attr('aria-pressed', 'false');
        $('#lightBtn').removeClass('active');
    }
});
