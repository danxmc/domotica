let http = require('http');
let express = require('express');
let io = require('socket.io');
let five = require("johnny-five");

// Create board instance
let board = new five.Board();
// Create app instance
let app = new express();

// Set the port number
let port = 3000;

// Set the app instance to read the public directory
// Will find index.html
app.use(express.static(__dirname + '/public'));

// Begin 'listening' on the pre defined port number (3000)
const server = http.createServer(app).listen(port, (req, res) => {
    console.log('LISTENING ON PORT ' + port);
});

// Set up socket.io to 'listen'
io = io.listen(server);

// board.on
board.on("ready", () => {
    // Connection message in the console
    console.log('ARDUINO BOARD READY STATE: TRUE');
    
    led = new five.Led(13);

    // Display a conection message
    io.on('connection', (socket) => {

        console.log('Socket.io connection:', socket.id);

        // Display a disconnection message
        socket.on('disconnect', () => {
            console.log('Socket.io disconnection:', socket.id);
        });

        socket.on('toggleLight', (data) => {
            // Checks the status sent by the toggleLight event
            data.status ? led.on() : led.off();
            // Emit toggleBtn event on all devices except
            // the one that made the original toggleLight event
            socket.broadcast.emit('toggleBtn', data);
            console.log(data);
        });

    });
});
