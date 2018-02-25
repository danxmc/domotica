let http = require('http');
let express = require('express');
let io = require('socket.io');
let five = require("johnny-five");
let mongoose = require('mongoose');
let passport = require('passport');
let flash = require('connect-flash');

let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let favicon = require('serve-favicon');
const keys = require('./config/keys');

// Create board instance
let board = new five.Board();
// Create app instance
let app = new express();

// Set the port number
let port = process.env.PORT || 80;

mongoose.Promise = global.Promise;
// Connect to db
mongoose.connect(keys.mongodb.url, {
    useMongoClient: true
}).then(() => {
    console.log('Conection to db domotics succesful...');
});

// passport configuration
require('./config/passport')(passport);

// use favicon
app.use(favicon(__dirname + '/public/assets/images/favicon.ico'));

// Set the app instance to read the public directory
app.use(express.static(__dirname + '/public'));

// log every request to the console
app.use(morgan('dev'));
// read cookies (needed for auth)
app.use(cookieParser());
// get information from html forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set up ejs for templating
app.set('view engine', 'ejs');

// Required for passport
app.use(session({
    secret: keys.session.secret, // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// use connect-flash for flash messages stored in session
app.use(flash());

// Routes
// Load our routes and pass in our app and fully configured passport
require('./routes/routes')(app, passport);

// Begin 'listening' on the pre defined port number
const server = http.createServer(app).listen(port, (req, res) => {
    console.log('LISTENING ON PORT ' + port);
});

// Set up socket.io to 'listen'
io = io.listen(server);

// board.on
board.on("ready", () => {
    // Connection message in the console
    console.log('ARDUINO BOARD READY STATE: TRUE');
    //let led = new five.Pin(13);
    let pinArray = [];
    pinArray[0] = new five.Pin(12);
    pinArray[1] = new five.Pin(11);
    pinArray[2] = new five.Pin(10);

    let inputPin = new five.Pin(2);

    // Initialize the RGB LED
    let ledRGB = new five.Led.RGB({
        pins: {
            red: 6,
            green: 5,
            blue: 3
        },
        isAnode: true
    });

    // Create an analog Thermometer object:
    let temperature = new five.Thermometer({
        controller: "LM35",
        pin: "A0",
        freq: 2 * 1000
    });

    // Display a conection message
    io.on('connection', (socket) => {

        console.log('Socket.io connection:', socket.id);

        // Display a disconnection message
        socket.on('disconnect', () => {
            console.log('Socket.io disconnection:', socket.id);
        });

        // Receives signal and toggles the appropriate Pin, broadcast's toggle signal to clients
        socket.on('toggleLight', (data) => {
            let no = data.btnNum;
            // Checks the status sent by the toggleLight event
            //data.status ? led.high() : led.low();
            //data.status ? five.Pin.write(led, 1) : five.Pin.write(led, 0);
            
            //data.status ? led.on() : led.off();

            data.status ? pinArray[no].high() : pinArray[no].low();

            pinArray[no].query((state) => {
                console.log(state);
            });
            console.log(data);

            // Emit toggleBtn event on all devices except the one that made the original toggleLight event
            socket.broadcast.emit('toggleBtn', data);
        });

        // RGB control
        socket.on('RGBcontrol', (data) => {
            let color = data.origHex;
            console.log(color);
            ledRGB.on();
            ledRGB.color(color);

            // Emit colorChangeInput event on all devices except the one that made the original RGBcontrol event
            socket.broadcast.emit('colorChangeInput', data);
        });

        // Reads input pin
        inputPin.read((error, value) => {
            let data = {
                value: value
            };
            //console.log(value);
            if (value == 1) {
                // if high
                io.sockets.emit('inputEvent', data);
            }
        });

        // Reads the thermometer
        temperature.on("data", () => {
            //console.log(temperature.C + "°C", temperature.F + "°F", temperature.K + "°K");
            let temp = {
                C: temperature.C,
                F: temperature.F,
                K: temperature.K
            };
            // Emits the showTemperature event to all devices
            io.sockets.emit('showtemperature', temp);
        });


    });

});
