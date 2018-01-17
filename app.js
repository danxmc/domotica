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
