let io = require('socket.io');
let five = require("johnny-five");

module.exports = (server) => {
    // Create board instance
    let board = new five.Board();

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
        pinArray[3] = new five.Pin(9);
        pinArray[4] = new five.Pin(8);
        let button = new five.Button(2);

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
            freq: 5 * 1000
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
                if (no == '3') {
                    infraredSignal(data);
                } else {
                    data.status ? pinArray[no].high() : pinArray[no].low();

                    pinArray[no].query((state) => {
                        console.log(state);
                    });
                    console.log(data);
                }


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
            button.on('down', () => {
                io.sockets.emit('inputEvent');
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

            function infraredSignal(data) {
                let pinOn = pinArray[3];
                let pinOff = pinArray[4];
                if (data.status) {
                    pinArray[3].high();
                    pinArray[3].low();
                } else {
                    pinArray[4].high();
                    pinArray[4].low();
                }
            }

        });

    });

}
/*
                setTimeout(() => {
                    pinif.low();
                    console.log("4");
                }, 50);

                setTimeout(() => {
                    pinif.high();
                    console.log("5");
                }, 10);
               
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, 1);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, 1);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, 1);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, 1);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, 1);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, 1);
                setTimeout(() => {
                    pinif.low();
                }, .1);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, 1);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, 1);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .1);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, 1);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
                setTimeout(() => {
                    pinif.high();
                }, .5);
                setTimeout(() => {
                    pinif.low();
                }, .5);
*/