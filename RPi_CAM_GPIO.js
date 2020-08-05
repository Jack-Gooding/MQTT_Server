const Gpio = require('pigpio').Gpio;
const mqtt = require('mqtt'); //MQTT protocols
const ffmpeg = require('fluent-ffmpeg');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const express_module = require('express');
const express = express_module();
const bodyParser = require('body-parser');
const expressPort = 3135;

const nodeWebcam = require("node-webcam");

let dateTime = function() {
  let date = moment().format("YYYY-MM-DD_HH-mm-ss");
  return date;
};

let recordVideo = ffmpeg('/dev/video0').size('100%').duration(15).on('end', function() {
  camAvailable = true;
  console.log("Camera Available");
})

var cameraOpts = {

   //Picture related

   width: 1280,

   height: 720,

   quality: 100,


   //Delay in seconds to take shot
   //if the platform supports miliseconds
   //use a float (0.1)
   //Currently only on windows

   delay: 0,


   //Save shots in memory

   saveShots: true,


   // [jpeg, png] support varies
   // Webcam.OutputTypes

   output: "png",


   //Which camera to use
   //Use Webcam.list() for results
   //false for default device

   device: false,


   // [location, buffer, base64]
   // Webcam.CallbackReturnTypes
   callbackReturn: "location",


   //Logging

   verbose: false

};


//Creates webcam instance

var Webcam = nodeWebcam.create( cameraOpts );


//Will automatically append location output type


const led = new Gpio(5, {mode: Gpio.OUTPUT});

const motionSensor = new Gpio(6, {
  mode: Gpio.INPUT,
  edge: Gpio.RISING_EDGE
});

const fan = new Gpio(23, {mode: Gpio.OUTPUT});

const ledString = new Gpio(25, {mode: Gpio.OUTPUT});



let pulseLedInterval;
let dutyCycle = 0;

let camActive = false;

let camAvailable = true;

let detectDebounce = false;
let detectionMade = false;
let noDetectDebounce = false;
let noDetectionCount = 0;

motionSensor.on('interrupt', (level) => {
  //level == 1 if detection
  if (camActive) {
    if (level === 1) {
      if (camAvailable) {
        camAvailable = false;
        console.log("Presence detected 👻👻");
        client.publish("rpi/motion", "detected");
        recordVideo.output(`${dateTime()}.mp4`).run();
      }

    }
  }
});


Webcam.capture( "test_picture", function( err, data ) {
  console.log(err != null ? err : data);
} );


const client  = mqtt.connect('mqtt://jack-gooding.com', {
    port: 1883,
    clientId: "RPi",
});


client.on('connect', () => {
  client.subscribe('rpi/led');
  client.subscribe('rpi/capture');
  client.subscribe('rpi/ledString');
});

client.on('message', async (topic, msg) => {
  message = msg.toString('utf8');


  if (topic === 'rpi/led') {
    if (message === "on") {
      console.log("MQTT cam on request");
      if (camActive == false) {
        camActive = true;
        pulseLed = setInterval(() => {
          dutyCycle += Math.PI/50;
          if (dutyCycle > 2*Math.PI) {
            dutyCycle = 0;
          };
          let ledVal = (Math.sin(dutyCycle-1)+1)*(254/2);
        	led.pwmWrite(Math.round(ledVal));
        }, 20);
      }
    } else {
      console.log("MQTT cam off request");
      camActive = false;
      clearInterval(pulseLed);
      dutyCycle = (dutyCycle === 0) ? 254 : 0;
      led.pwmWrite(dutyCycle);
    }
  } else if (topic === "rpi/capture") {

  } else if (topic === "rpi/ledString") {
    if (message.toInt() > 0) {
      ledString.digitalWrite(1);
    } else {
      ledString.digitalWrite(0);
    }
  }

});



express.use(bodyParser.json());
express.use(bodyParser.urlencoded({ extended: true }));


express.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


express.listen(expressPort, () => {
  console.log("Express server listening on port: " + expressPort);
});

express.get("/api/cam/capture", async (req, res) => {
  Webcam.capture( "test_picture", function( err, data ) {
    // const img = fs.readFileSync('test_picture.png', {encoding: 'base64'});
    // res.send(img);
    let options = {
      root: path.join(__dirname, ''),
      dotfiles: 'deny',
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
      }
    };

    res.contentType(data);
    res.sendFile(`${data}`, options, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Sent!');
      }
    });
  });
  res.end();
});

process.on('SIGINT', () => {
  led.pwmWrite(0);
  console.log('Process terminated');
  process.exit();
})
