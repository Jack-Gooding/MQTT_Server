const Gpio = require('pigpio').Gpio;
const gpio_tools = require('./helpers/GPIO_Tools.js');

const mqtt = require('mqtt'); //MQTT protocols
const bodyParser = require('body-parser');

require('dotenv').config();
const username = process.env.USERN;
const password = process.env.PASS;

let dateTime = function() {
  let date = moment().format("YYYY-MM-DD_HH-mm-ss");
  return date;
};


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


const led = new Gpio(5, {mode: Gpio.OUTPUT});

const motionSensor = new Gpio(6, {
  mode: Gpio.INPUT,
  edge: Gpio.RISING_EDGE
});

const fan = new Gpio(23, {mode: Gpio.OUTPUT});

const ledString = new Gpio(25, {mode: Gpio.OUTPUT});

let gpio_items = [
  {
    name: "Indicator Led",
    gpio: new Gpio(5, {mode: Gpio.OUTPUT}),
    interval: null,
    value: 0,
  },
  {
    name: "Motion Sensor",
    gpio: new Gpio(6, {
      mode: Gpio.INPUT,
      edge: Gpio.RISING_EDGE
    }),
    interval: null,
    value: 0,
  },
  {
    name: "RPi Fan",
    gpio: new Gpio(23, {mode: Gpio.OUTPUT}),
    interval: null,
    value: 0,
  },
  {
    name: "Led String",
    gpio: new Gpio(25, {mode: Gpio.OUTPUT}),
    interval: null,
    value: 0,
  },

];

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
      }

    }
  }
});

const client  = mqtt.connect('mqtts://jack-gooding.com', {
    port: 8883,
    clientId: "Raspberry Pi Webcam",
    username: username,
    password: password,
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
    if (parseInt(message) > 0 && parseInt(message) != null) {
      ledString.digitalWrite(1);
    } else {
      ledString.digitalWrite(0);
    }
  }

});

process.on('SIGINT', () => {
  led.pwmWrite(0);
  console.log('Process terminated');
  process.exit();
})
