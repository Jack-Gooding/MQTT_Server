//
//
// This script is intended to be run on a remote, always-on host (AWS EC2 instance or Azure similar would be suitable.)
//

const mqtt = require("mqtt"); //MQTT protocols
const aedes = require("aedes")(); //MQTT Server Host

const WebSocket = require("ws"); //Websockets for socket

const fs = require("fs"); //required for reading SSL/TLS certs.

const cors = require("cors");
const express = require("express");
const server = express();
const bodyParser = require("body-parser");

require("dotenv").config();

const username = process.env.USERN;
const password = process.env.PASS;

const ssl_key = process.env.KEY;
const ssl_cert = process.env.CERT;

const ssl_fingerprint = process.env.FINGERPRINT;
const authToken = process.env.AUTH_TOKEN;

// const mqtt_server = require('net').createServer(aedes.handle);

//Key Certs should be used.
const options = {
  key: fs.readFileSync(ssl_key),
  cert: fs.readFileSync(ssl_cert),
};

const mqttPort = 1883;
const mqttsPort = 8883;
const expressPort = 3255;

let connectedClients = [];

//Data stores for deviceStates
let sockets = []; // sockets array to track Websocket connections

let lights = []; //Phillips Hue Lights
let plugs = [
  {
    name: "Example",
    id: 0,
    on: true,
  },
]; //TP-Link plugs
let volume = 0;
let temperature = 20 + Math.floor(Math.random() * 50) / 10;
let deskLights = 0;

let climateSensors = [
  {
    sensorId: "ExampleSensor",
    location: "Living Room #1",
    friendlyName: "Living Room #1",
    temperature: 20 + Math.floor(Math.random() * 50) / 10,
    humidity: 30 + Math.floor(Math.random() * 50),
  },
];

const mqtts_server = require("tls").createServer(options, aedes.handle);
// const mqtt_server = require('net').createServer(aedes.handle);

const client = mqtt.connect("mqtts://jack-gooding.com", {
  port: 8883,
  clientId: "MQTT Broker",
  username: username,
  password: password,
});

client.on("connect", async () => {
  client.subscribe("devices/request");
  client.subscribe("broker/lights");
  client.subscribe("broker/plugs");
  client.subscribe("broker/volume");
  client.subscribe("broker/temperatures");

  client.subscribe("keypad/button/pressed");
  client.subscribe("keypad/button/released");
  client.subscribe("desk/lights");
});

client.on("message", async (topic, msg) => {
  message = msg.toString("utf8");

  //
  //Broker Instructions
  //
  if (topic === "devices/request") {
    client.publish(
      "clients/connected",
      JSON.stringify({ clients: connectedClients })
    );
  } else if (topic === "broker/lights") {
    lights = JSON.parse(message);
    console.log(`Received lights volume update: ${lights}`);
  } else if (topic === "broker/volume") {
    volume = JSON.parse(message);
    console.log(`Received PC volume update: ${volume}`);

    sockets.forEach((socket) => {
      if (socket.url === "desktop") {
        if (socket.ws.readyState === WebSocket.OPEN) {
          // socket.ws.send(JSON.stringify(['keypad', {topic, message}]));
          socket.ws.send(
            JSON.stringify([
              "desktop/volume",
              { topic: "desktop/volume", message: volume },
            ])
          );
          // socket.ws.send(JSON.stringify(['desktop/volume', {topic: "desktop/volume", message: volume}]));
        }
      }
    });
  } else if (topic === "broker/temperatures") {

    JSON.parse(message).forEach(sensor => {
      let temperature = sensor.temperature;
      let humidity = sensor.humidity;

      let sensorIndex = climateSensors.findIndex(a => a.sensorId === sensor.id);
      console.log(sensorIndex);
      if (sensorIndex == null) {

        climateSensors.push(sensor);

      } else {

        climateSensors[sensorIndex].temperature = temperature;

        if (humidity) {
          climateSensors[sensorIndex].humidity = humidity;
        }

      }

      let testSensorIndex = climateSensors.findIndex(a => a.sensorId === "ExampleSensor");
      if (testSensorIndex != null) {
        // climateSensors.splice(testSensor, 1);
        climateSensors.shift();
      }

    });


  }

  //
  //Websocket Instructions
  //
  if (topic.split("/")[0] === "keypad" && topic.split("/")[1] === "button") {
    sockets.forEach((socket) => {
      if (socket.url === "keypad") {
        if (socket.ws.readyState === WebSocket.OPEN) {
          socket.ws.send(JSON.stringify(["keypad", { topic, message }]));
        }
      }
    });
  }

  if (topic === "broker/plugs") {
    console.log("broker/plugs");
    // console.log(sockets.length);
    plugs = JSON.parse(message);
    console.log(plugs);
    sockets.forEach((socket) => {
      console.log(socket);
      if (socket.url === "plugs") {
        if (socket.ws.readyState === WebSocket.OPEN) {
          socket.ws.send(JSON.stringify(["plugs", { topic, message }]));
        }
      }
    });
  }

  if (topic === "desk/lights") {
    console.log("desk/lights");
    // console.log(sockets.length);
    deskLights = parseInt(message) > 0 || message == "on" ? 255 : 0;
    console.log(`sockets`);

    console.log(sockets);
    sockets.forEach((socket) => {
      if (socket.url === "desk/lights") {
        console.log(`==========`);
        console.log(`SOCKETS FOUND!`);
        console.log(`==========`);
        if (socket.ws.readyState === WebSocket.OPEN) {
          socket.ws.send(JSON.stringify(["desk/lights", { topic, message }]));
        }
      }
    });
  }
});

// No longer using unsecured connection.
// mqtt_server.listen(mqttPort, async function () {
//   console.log('MQTT client started and listening on port ', mqttPort);
// });

let reportConnectedClients = () => {
  client.publish(
    "clients/connected",
    JSON.stringify({ clients: connectedClients })
  );
};

aedes.authenticate = (client, c_username, c_password, callback) => {
  let client_username = client.parser.settings.username;
  let client_password;
  console.log(`Authentication Attempted - ${client_username}`);
  if (client.parser.settings.password != null) {
    //toString() is required because password is typically sent as a buffer.
    client_password = client.parser.settings.password.toString();
  }
  if (
    username === client_username &&
    password === client_password &&
    client_password != null
  ) {
    callback(null, username);
    console.log("Authentication Success!");
    console.log(`Successful Connection: ${client.id}`);
    console.log(`Total Connections: ${aedes.connectedClients}`);
    connectedClients.push(client.id);
    console.log(connectedClients);
    reportConnectedClients();
  } else {
    console.log("Authentication Failure!");
    let error = new Error("Auth error");
    error.returnCode = 4;
    callback(error, null);
  }
};

mqtts_server.listen(mqttsPort, async function () {
  console.log("MQTTs client started and listening on port ", mqttsPort);
});

aedes.on("client", async function (client) {
  // console.log(client);
});

aedes.on("subscribe", async function (topic, deliverfunc) {
  console.log("Successful Subscription: ");
  console.log(topic[0]);
  client.publish("subscription/topic", JSON.stringify(topic[0])); //This is commented out in working v.
});

aedes.on("clientReady", async function (device) {
  //'clientReady' is before authentication, better to do it on successful auth.
});

aedes.on("publish", async function (packet, client) {
  console.log("Something Published:");
  if (client != null) {
    console.log(`Client: ${client.id}`);
  }
  console.log(`Topic: ${packet.topic} - Message: ${packet.payload}`);
});

aedes.on("clientDisconnect", async function (device) {
  console.log(`Client Disconnected: ${device.id}`);
  console.log(`Total Connections: ${aedes.connectedClients}`);
  for (let i = connectedClients.length - 1; i >= 0; i--) {
    if (device.id == connectedClients[i]) {
      connectedClients.splice(i, 1);
    }
  }
  console.log(connectedClients);
  client.publish(
    "clients/connected",
    JSON.stringify({ clients: connectedClients })
  );
});

server.use(cors());
server.use(bodyParser.json());
server.listen(expressPort, async () => {
  console.log("Express server listening on port " + expressPort);
});

server.get("/", async (req, res) => {
  res.send("Test Complete, Broker Activated!");
});

server.get("/devices", async (req, res) => {
  res.send(connectedClients);
});

server.get("/lights", async (req, res) => {
  client.publish("lights/request");
  res.send(lights);
});

server.get("/plugs", async (req, res) => {
  client.publish("plugs/request");
  console.log(plugs);
  res.send(plugs);
});

server.get("/desktop/volume", async (req, res) => {
  client.publish("volume/request");
  res.send({ volume: volume });
});

server.get("/temperature", async (req, res) => {
  res.send({ temperature: temperature });
});

server.get("/climate-sensors", async (req, res) => {
  res.send({ sensors: climateSensors });
});

server.put("/lights", async (req, res) => {
  res.send(req.body);
  client.publish("lights/update", JSON.stringify(req.body));
});

server.put("/plugs", async (req, res) => {
  res.send(req.body);
  console.log(plugs);
  console.log(req.body);
  req.body.forEach((reqPlug) => {
    plugs.forEach((plug) => {
      console.log(plug);
      if (reqPlug.id === plug.id && reqPlug.name === plug.name) {
        plug.on = reqPlug.on;
      }
    });
  });
  console.log(plugs);

  sockets.forEach((socket) => {
    if (socket.url === "plugs") {
      if (socket.ws.readyState === WebSocket.OPEN) {
        // socket.ws.send(JSON.stringify(['keypad', {topic, message}]));
        socket.ws.send(
          JSON.stringify(["plugs", { topic: "broker/plugs", message: plugs }])
        );
      }
    }
  });

  client.publish("plugs/update", JSON.stringify(req.body));
});

server.put("/desktop/volume", async (req, res) => {
  res.send(req.body);
  // console.log(volume);
  volume = req.body.volume / 100;
  // console.log(volume);
  sockets.forEach((socket) => {
    if (socket.url === "desktop") {
      if (socket.ws.readyState === WebSocket.OPEN) {
        // socket.ws.send(JSON.stringify(['keypad', {topic, message}]));
        socket.ws.send(
          JSON.stringify([
            "desktop/volume",
            { topic: "desktop/volume", message: volume },
          ])
        );
        // socket.ws.send(JSON.stringify(['desktop/volume', {topic: "desktop/volume", message: volume}]));
      }
    }
  });
  client.publish("python/volume", JSON.stringify(req.body));
});

server.put("/ws2812b/ring", async (req, res) => {
  client.publish("/ws2812b/ring");
  res.send({ ring: "warm" });
});

server.put("/desk/lights", async (req, res) => {
  let state =
    req.body.value <= 255 ||
    req.body.value == null ||
    !req.body.value ||
    req.body.value.length === 0
      ? 0
      : 255;

  client.publish("desk/lights", state);
  deskLights = state;
});

// receives POST requests from IFTTT when a user enters or exits a specific area.
server.post("/ifttt/status", async (req, res) => {
  console.log(req.body);
  res.send("Thanks, IFTTT!");
  //Most recent headers - Identifiable info in here?
  //'x-newrelic-id': 'VwAOU1RRGwAFUFZUAwQE',
  //'x-newrelic-transaction': 'PxRUBF5RC1YGVlYHA1cDV11UFB8EBw8RVU4aAV0ABgFWUwtWVFVVVlUPUkNKQQkGUQZSBAcIFTs=' },

  //Example data packet - build server logic from this.
  //{ image:
  //  { url: 'https://maps.google.com/?q=50.6978488,-3.4834294&z=18' },
  //enteredOrExited: 'exited',
  //occurredAt: 'September 22, 2020 at 01:50PM',
  //user: 'Jack' }

  let mqttPayload = {
    user: req.body.user,
    enteredOrExited: req.body.enteredOrExited,
    occurredAt: req.body.occurredAt,
  };
  client.publish("ifttt/home", JSON.stringify(mqttPayload));
});

function noop() {}
function heartbeat() {
  this.isAlive = true;
}

const wss = new WebSocket.Server({ port: 3233 });

// wss.on('connection', function connection(ws) {
//   ws.isAlive = true;
//   ws.on('pong', heartbeat);
// });

let connectionsCount = 0;

// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });
//   count++;
//   ws.send(count);
// });

const interval = setInterval(function ping() {
  let socketsToRemove = [];

  sockets.forEach(function each(socket, index) {
    if (socket.ws.isAlive === false) {
      socketsToRemove.push(socket);
      return socket.ws.terminate();
    }
    socket.ws.isAlive = false;
    socket.ws.ping(noop);
  });

  socketsToRemove.forEach((item, i) => {
    socketIndex = sockets.findIndex((socket) => socket == item);
    sockets.splice(socketIndex, 1);
  });

  // console.log("sockets.length: " + sockets.length);
}, 3000);

wss.on("close", function close(ws) {
  clearInterval(interval);
});

wss.on("connection", function connection(ws, req) {
  let socket = { ws: ws };
  socket.ws.isAlive = true;
  const ip = req.socket.remoteAddress;
  // console.log(ip);
  // console.log("url: ", req.url.split("/")[1]);
  socket.url = req.url.split("/")[1];

  connectionsCount++;

  socket.ws.on("message", function incoming(data) {
    // wss.clients.forEach(function each(c) {
    //   if (c.readyState === WebSocket.OPEN) {
    //     c.send(connectionsCount);
    //   }
    // });

    if (data.url === "/plugs" || JSON.parse(data).url === "/plugs") {
      // console.log(JSON.parse(data));
      console.log(plugs);
      console.log(
        JSON.stringify(["plugs", { topic: "broker/plugs", message: plugs }])
      );
      socket.ws.send(
        JSON.stringify(["plugs", { topic: "broker/plugs", message: plugs }])
      );
    }
    if (
      data.url === "/desk/lights" ||
      JSON.parse(data).url === "/desk/lights"
    ) {
      // console.log(JSON.parse(data));
      socket.ws.send(
        JSON.stringify([
          "desk/lights",
          { topic: "desk/lights", message: deskLights },
        ])
      );
    }
    if (
      data.url === "/desktop/volume" ||
      JSON.parse(data).url === "/desktop/volume"
    ) {
      // console.log(JSON.parse(data));
      socket.ws.send(
        JSON.stringify([
          "desktop/volume",
          { topic: "desktop/volume", message: volume },
        ])
      );
    }
  });

  socket.ws.on("pong", heartbeat);

  sockets.push(socket);
});
