const {client, mqttConnect} = require("./helpers/MQTT");

const hueHelpers = require("./helpers/Philips_Hue");
const tpLinkHelpers = require("./helpers/TPLink");
const keyTracker = require("./helpers/Key_Tracker");
const keyBehaviours = require("./helpers/Key_Behaviour");
const ws2812B = require("./helpers/WS2812B");
const blinds = require("./helpers/Blinds");
const custom = require("./helpers/Custom_Devices");

const express_module = require('express');
const express = express_module();
const bodyParser = require('body-parser');
const expressPort = 3254;

const axios = require("axios");

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 2700 });

let filterApplied = false;

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send(message);
  });

  ws.send('response');
});


let moment = require('moment');

client.on('message', async (topic, msg) => {
  message = msg.toString('utf8');


  if (topic === 'device/connected') {
    //client.publish('device/on', deviceState);
    //console.log('updating device/on with %s', deviceState);
    connected = (message.toString() === 'true');
  } else if (topic === 'clients/connected') {
    console.log(message);
  } else if (topic === 'device/state') {
    deviceState = message;

  } else if (topic === 'keypad/button/pressed') {
    if (filterApplied) {
      if (message == "button2") {
        client.publish("rpi/led", "off");
      } else if (message == "button6") {
        client.publish("rpi/led", "on");
      } else if (message == "button5") {
        keyTracker.handlePresses(true,message,keyBehaviours.lights_down);
      } else if (message == "button9") {
        keyTracker.handlePresses(true,message,keyBehaviours.lights_up);
      } else if (message == "button4") {
        keyTracker.handlePresses(true,message,keyBehaviours.switches_off);
      } else if (message == "button8") {
        keyTracker.handlePresses(true,message,keyBehaviours.switches_on);
      } else if (message == "button3") {
        client.publish("bedroom/blinds", JSON.stringify({steps: -95000, dir: "down"}));
      } else if (message == "button7") {
        client.publish("bedroom/blinds", JSON.stringify({steps: 95000, dir: "up"}));
      }
    } else {

      if (message == "button1") {
        filterApplied = true;
        console.log("Filter On");
        keyTracker.clearTimers();
        ws2812B.layerIndidicator();
        // client.publish("neopixel/ring/leds", JSON.stringify({red: 0, green: 0, blue: 255}));


        // custom.setScreenLights("" + Math.round(Math.random()));
        //ws2812B.randomiseColours();
        client.publish("bedroom/blinds", JSON.stringify({steps: 0, dir: "up"}));
      } else if (message == "button2") {
        keyTracker.handlePresses(true,message,keyBehaviours.keyboard_down);

        /* //This is in place to test IFTTT home payload.
           //Does not trigger IFTTT webhook, but emulates a known payload.
        const data = {
            image: { url: 'https://maps.google.com/?q=50.6978488,-3.4834294&z=18' },
            enteredOrExited: 'exited',
            occurredAt: 'September 22, 2020 at 01:50PM',
            user: 'Jack',
          };
        axios.post("https://broker.jack-gooding.com/ifttt/status", data)
          .then(res => console.log(res))
          .catch(err => console.log(err));
*/
      } else if (message == "button6") {
        keyTracker.handlePresses(true,message,keyBehaviours.keyboard_up);
      } else if (message == "button3") {
        keyTracker.handlePresses(true,message,keyBehaviours.leds_off);
      } else if (message == "button7") {
        keyTracker.handlePresses(true,message,keyBehaviours.leds_on);
      } else if (message == "button4") {
        keyTracker.handlePresses(true,message,keyBehaviours.switch_off);
      } else if (message == "button8") {
        keyTracker.handlePresses(true,message,keyBehaviours.switch_on);
      } else if (message == "button5") {
        keyTracker.handlePresses(true,message,keyBehaviours.light_down);
      } else if (message == "button9") {
        keyTracker.handlePresses(true,message,keyBehaviours.light_up);
      } else {
        hueHelpers.randomiseLights();
      }
    }
  } else if (topic === 'keypad/button/released') {
    if (filterApplied) {
      if (message == "button1") {
        filterApplied = false;
        console.log("Filter Off");
        keyTracker.clearTimers();
        ws2812B.releaseIndicator();
        //ws2812B.randomiseColours();
      } else if (message == "button5") {
        keyTracker.handlePresses(false,message,keyBehaviours.lights_down);
      } else if (message == "button9") {
        keyTracker.handlePresses(false,message,keyBehaviours.lights_up);
      } else if (message == "button4") {
        keyTracker.handlePresses(false,message,keyBehaviours.switches_off);
      } else if (message == "button8") {
        keyTracker.handlePresses(false,message,keyBehaviours.switches_on);
      }
    } else {
      if (message == "button5") {
        keyTracker.handlePresses(false,message,keyBehaviours.light_down);
      } else if (message == "button2") {
        keyTracker.handlePresses(false,message,keyBehaviours.keyboard_down);
      } else if (message == "button6") {
        keyTracker.handlePresses(false,message,keyBehaviours.keyboard_up);
      } else if (message == "button9") {
        keyTracker.handlePresses(false,message,keyBehaviours.light_up);
      } else if (message == "button4") {
        keyTracker.handlePresses(false,message,keyBehaviours.switch_off);
      } else if (message == "button3") {
        keyTracker.handlePresses(false,message,keyBehaviours.leds_off);
      } else if (message == "button7") {
        keyTracker.handlePresses(false,message,keyBehaviours.leds_on);
      } else if (message == "button8") {
        keyTracker.handlePresses(false,message,keyBehaviours.switch_on);
      }
    }
  } else if (topic === "rpi/motion") {
    if (message == "detected") {
      ws2812B.randomiseColours();
    } else if (message == "clear") {
      ws2812B.allOff();
    }
  } else if (topic === "ifttt/home") {
    let msg = JSON.parse(message);
    if (msg.enteredOrExited === "entered") {
      console.log("HOME, MOTION SENSOR OFF");
      client.publish("rpi/led", "on");
      hueHelpers.toggleLights(true);
      tpLinkHelpers.toggle(0,true);
      tpLinkHelpers.toggle(1,true);
      custom.setScreenLights("255");
      custom.setRPiLights("255");
    } else if (msg.enteredOrExited === "exited") {
      console.log("AWAY FROM HOME, MOTION SENSOR ON");
      client.publish("rpi/led", "off");
      hueHelpers.toggleLights(false);
      tpLinkHelpers.toggle(0,false);
      tpLinkHelpers.toggle(1,false);
      custom.setScreenLights("0");
      custom.setRPiLights("0");
    };
  } else if (topic == 'test/on') {

  } else if (topic == 'test/num') {

  } else if (topic == 'lights/request') {
      hueHelpers.updateLights();
  } else if (topic == 'lights/update') {// Here begins all broker requests for local data
    let msg = JSON.parse(message);
    msg.forEach(light => {
      if (light.on != null) {
        hueHelpers.toggleLights(light.on, light.id);
      };
      if (light.brightness != null) {
        hueHelpers.setBrightness(light.brightness, light.id)
      };
    });
  } else {
    console.log("unrecognised message: "+message)
  }

});

setInterval(async function() {
  tpLinkHelpers.discoverPlugs();
  hueHelpers.prepareHue();
},60000);
tpLinkHelpers.discoverPlugs();
hueHelpers.prepareHue();


express.use(bodyParser.json());
express.use(bodyParser.urlencoded({ extended: true }));

express.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

express.listen(expressPort, async () => {
  console.log("Express server listening on port: " + expressPort);
});


express.get("/", async (req, res) => {
  res.status(200);
  res.send("Thanks, nothing here yet!");
});

express.get("/api/hue", async (req,res) => {
  res.send(hueHelpers.lights)
})


setTimeout( async function() {
  console.log("sending ON");
  client.publish("device/on", "on");
},2000);
