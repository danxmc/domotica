// Make connection
let socket = io.connect(window.location.hostname + ':' + 80);

// Emit events
//Light emitter event
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
//RGB control event
$(".RGBcontrol").on('click', (e) => {
    e.preventDefault;

    let btnRGB = document.getElementById("colorpicker").value;
    let hexvals = btnRGB.split("#");
    let hexval = hexvals[1].match(/.{1,2}/g);
    let color = "#" + (255 - (parseInt(hexval[0], 16))).toString(16) + (255 - (parseInt(hexval[1], 16))).toString(16) + (255 - (parseInt(hexval[2], 16))).toString(16);

    //console.log('color: ' + color);
    socket.emit('RGBcontrol', {
        hex: color
    })
})
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

socket.on('inputEvent', (data) => {
    let dt = new Date();
    let time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    document.getElementById('logRoom').innerHTML = "";
    $('#logRoom').append("<p>Se ingresó al cuarto " + time + "</p>");
    //console.log(data);
});