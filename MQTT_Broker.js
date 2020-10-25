//
//
// This script is intended to be run on a remote, always-on host (AWS EC2 instance or Azure similar would be suitable.)

const mqtt = require('mqtt'); //MQTT protocols
const aedes = require('aedes')(); //MQTT Server Host
const fs = require('fs'); //required for reading SSL/TLS certs.
const express = require('express'); //Not needed but copying working version.
const server = express();
const cors = require('cors');

require('dotenv').config();
const username = process.env.USERN;
const password = process.env.PASS;

const ssl_key = process.env.KEY;
const ssl_cert = process.env.CERT;

// const mqtt_server = require('net').createServer(aedes.handle);

//Key Certs should be used.
const options = {
  key: fs.readFileSync(ssl_key),
  cert: fs.readFileSync(ssl_cert),
};

const mqttPort = 1883;
const mqttsPort = 8883;
const expressPort = 3256;

let connectedClients = [];

//Data stores for deviceStates
let lights = [];

const mqtts_server = require('tls').createServer(options, aedes.handle);
// const mqtt_server = require('net').createServer(aedes.handle);


const client  = mqtt.connect('mqtts://jack-gooding.com', {
    port: 8883,
    clientId: "MQTT Broker",
    username: username,
    password: password
});


client.on('connect', async () => {
  client.subscribe('devices/request');
  client.subscribe('broker/lights');
});

client.on('message', async (topic, msg) => {
  message = msg.toString('utf8');
  if (topic === 'devices/request') {
    client.publish('clients/connected', JSON.stringify({clients: connectedClients}));
  } else if (topic === 'broker/lights') {
    console.log(lights);
    lights = JSON.parse(message);
  };
});

// No longer using unsecured connection.
// mqtt_server.listen(mqttPort, async function () {
//   console.log('MQTT client started and listening on port ', mqttPort);
// });

let reportConnectedClients = () => {
  client.publish('clients/connected', JSON.stringify({clients: connectedClients}));
};


aedes.authenticate = (client, c_username, c_password, callback)  => {
  let client_username = client.parser.settings.username;
  let client_password;
  console.log(`Authentication Attempted - ${client_username}`);
  if (client.parser.settings.password != null) {
    //toString() is required because password is typically sent as a buffer.
    client_password = client.parser.settings.password.toString();
  }
  if (username === client_username && password === client_password && client_password != null) {
    callback(null, username);
    console.log("Authentication Success!");
    console.log(`Successful Connection: ${client.id}`);
    console.log(`Total Connections: ${aedes.connectedClients}`);
    connectedClients.push(device.id);
    console.log(connectedClients);
    reportConnectedClients();

  } else {
    console.log("Authentication Failure!");
    let error = new Error('Auth error');
    error.returnCode = 4;
    callback(error, null);
  }
};

mqtts_server.listen(mqttsPort, async function () {
  console.log('MQTTs client started and listening on port ', mqttsPort);
});

aedes.on('client', async function(client) {
  // console.log(client);
});

aedes.on('subscribe', async function(topic , deliverfunc) {
  console.log("Successful Subscription: ");
  console.log(topic[0]);
  client.publish('subscription/topic',JSON.stringify(topic[0])); //This is commented out in working v.
});

aedes.on('clientReady', async function(device) {
  //'clientReady' is before authentication, better to do it on successful auth.
});

aedes.on('publish', async function(packet, client) {
  console.log('Something Published:');
  if (client.id != null) {
    console.log(`Client: ${client.id}`);
  }
  console.log(`Topic: ${packet.topic} - Message: ${packet.payload}`);
});

aedes.on('clientDisconnect', async function(device) {
  console.log(`Client Disconnected: ${device.id}`);
  console.log(`Total Connections: ${aedes.connectedClients}`);
  for (let i = connectedClients.length-1; i >= 0; i--) {
    if (device.id == connectedClients[i]) {
      connectedClients.splice(i, 1);
    }
  }
  console.log(connectedClients);
  client.publish('clients/connected', JSON.stringify({clients: connectedClients}));
});

server.use(bodyParser.json());
server.listen(expressPort, async () => {
  console.log("Express server listening on port " +expressPort);
});

server.get("/", async (req, res) => {
  res.send("Test Complete, Broker Activated!");
});

server.get("/lights", async (req, res) => {
  let res = await client.publish("lights/request");
  res.send(lights);
});

server.put("/lights", async (req, res) => {
  res.send(req.data);
  client.publish("lights/update", JSON.stringify(req.data));
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
    occurredAt: req.body.occurredAt
  }
  client.publish('ifttt/home', JSON.stringify(mqttPayload));
});
