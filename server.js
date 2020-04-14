const {client} = require("./helpers/MQTT");
const hueHelpers = require("./helpers/Philips_Hue");
const tpLinkHelpers = require("./helpers/TPLink");
const keyTracker = require("./helpers/Key_Tracker");
const keyBehaviours = require("./helpers/Key_Behaviour");
const ws2812B = require("./helpers/WS2812B");

const express_module = require('express');
const express = express_module();
const bodyParser = require('body-parser');
const expressPort = 5000;

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 2700 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send(message);
  });

  ws.send('response');
});


let moment = require('moment');

client.on('message', (topic, msg) => {
  message = msg.toString('utf8');


  if (topic === 'device/connected') {
    client.publish('device/on', deviceState);
    console.log('updating device/on with %s', deviceState);
    connected = (message.toString() === 'true');
  } else if (topic === 'device/state') {
    deviceState = message;

  } else if (topic === 'keypad/button/pressed') {
    if (message == "button1") {
      client.publish("test/num", JSON.stringify({value:Math.floor(Math.random()*255)}));
      console.log("button");
    } else if (message == "button2") {
      client.publish("desk/lights", "off");
    } else if (message == "button6") {
      client.publish("desk/lights", "on");
    } else if (message == "button3") {
      let x = client.publish("keypad/leds", ws2812B.allOff());

    } else if (message == "button7") {
      //client.publish("device/on", "on");

      keyTracker.handlePresses(true,message,keyBehaviours.leds);
    } else if (message == "button4") {
      keyTracker.handlePresses(true,message,keyBehaviours.switches_off);
    } else if (message == "button8") {
      keyTracker.handlePresses(true,message,keyBehaviours.switches_on);
    } else if (message == "button5") {
      keyTracker.handlePresses(true,message,keyBehaviours.light_down);
    } else if (message == "button9") {
      keyTracker.handlePresses(true,message,keyBehaviours.light_up);
    } else {
      hueHelpers.randomiseLights();
    }
  } else if (topic === 'keypad/button/released') {
    if (message == "button5") {
      keyTracker.handlePresses(false,message,keyBehaviours.light_down);
    } else if (message == "button9") {
      keyTracker.handlePresses(false,message,keyBehaviours.light_up);
    } else if (message == "button4") {
      keyTracker.handlePresses(false,message,keyBehaviours.switches_off);
    } else if (message == "button7") {
      keyTracker.handlePresses(false,message,keyBehaviours.leds);
    } else if (message == "button8") {
      keyTracker.handlePresses(false,message,keyBehaviours.switches_on);
    }
  } else if (topic == 'test/on') {
    console.log(message);
    if (message == "on") {
      ws2812B.randomiseColours();
    } else if (message == "off") {
      ws2812B.allOff();
    }
  } else if (topic == 'test/num') {
    console.log(JSON.parse(message).value);
    client.publish('desk/lights',JSON.stringify({value:JSON.parse(message).value}));
  } else {

    console.log("unrecognised message: "+message)
  }
});

setInterval(async function() {
  tpLinkHelpers.discoverPlugs();
  hueHelpers.prepareHue();
},10000);


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

express.listen(expressPort, () => {
  console.log("Express server listening on port: " + expressPort);
});


express.get("/", (req, res) => {
  res.status(200);
  res.send("Thanks, nothing here yet!");
});

express.get("/api/hue", (req,res) => {
  res.send(hueHelpers.lights)
})


setTimeout(function() {
  console.log("sending ON");
  client.publish("device/on", "on");
},2000);
