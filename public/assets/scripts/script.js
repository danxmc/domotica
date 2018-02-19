// Make connection
let socket = io.connect(window.location.hostname + ':' + 80);

// Event emitters
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
$("#colorPicker").on('change', (e) => {
    e.preventDefault;

    let btnRGB = document.getElementById("colorPicker").value;
    let hexvals = btnRGB.split("#");
    let hexval = hexvals[1].match(/.{1,2}/g);
    let color = "#" + (255 - (parseInt(hexval[0], 16))).toString(16) + (255 - (parseInt(hexval[1], 16))).toString(16) + (255 - (parseInt(hexval[2], 16))).toString(16);

    console.log('color: ' + color);
    socket.emit('RGBcontrol', {
        hex: color
    });
});

// Event listeners
// Light class button listener
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

// Input pin listener
socket.on('inputEvent', (data) => {
    let dt = new Date();
    let time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    document.getElementById('logRoom').innerHTML = "";
    $('#logRoom').append("<p>Se ingresó al cuarto " + time + "</p>");
    //console.log(data);
});