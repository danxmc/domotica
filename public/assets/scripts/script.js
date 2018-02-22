// Make connection
let socket = io.connect(window.location.hostname + ':' + 80);

// Event emitters
//Light emitter event
$(".lightBtn").on('click', (e) => {
    e.preventDefault;
    let btn = e.target.id;
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
$(".colorPicker").on('change', (e) => {
    e.preventDefault;
    //Separates the hex into 3, the RGB values in hex
    let cpid = e.target.id;
    let btnRGB = document.getElementById(cpid).value;
    let hexvals = btnRGB.split("#");
    let hexval = hexvals[1].match(/.{1,2}/g);
    let color = "#";
    // Inverts each hex portion
    hexval.forEach(element => {
        let digi = (255 - (parseInt(element, 16))).toString(16);
        if (digi.length < 2) {
            color += "0" + digi;
        } else {
            color += digi;
        }
    });

    // Emitts an event to the server
    console.log('color: ' + color);
    socket.emit('RGBcontrol', {
        invHex: color,
        origHex: btnRGB,
        id: cpid
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
    //document.getElementById('logRoom').innerHTML = "";
    $('#logRoom').prepend("<div class='alert alert-info'>Se ingresó al cuarto el "+time+" °C</div>");
    //console.log(data);
});

// Color change listener
socket.on('colorChangeInput', (data) => {
    let id = data.id;
    let color = data.origHex;
    // Sets the color picker's color to the one the emitter sent
    $('#' + id).val(color);
    //console.log(data);
});
socket.on('showtemperature', (data)=> {
    let temp = data;
    document.getElementById("temp").innerHTML="<div class='alert alert-warning'>La Temperatura del cuarto es: "+data+" °C</div>";
})