//
//
// This script is intended to be run on a remote, always-on host (AWS EC2 instance or Azure similar would be suitable.)

const mqtt = require('mqtt'); //MQTT protocols
const aedes = require('aedes')(); //MQTT Server Host

require('dotenv').config();
const username = process.env.USERN;
const password = process.env.PASS;


const mqttPort = 1883;
const mqttsPort = 8883;
const expressPort = 3256;

let connectedClients = [];

const options = {
  // key: fs.readFileSync(ssl_key),
  // cert: fs.readFileSync(ssl_cert),
};

const client  = mqtt.connect('mqtt://127.0.0.1', {
    port: 1883,
    clientId: "MQTT Broker",
    username: username,
    password: password
});

const mqtts_server = require('tls').createServer(options, aedes.handle);
const mqtt_server = require('net').createServer(aedes.handle);

aedes.authenticate = (client, c_username, c_password, callback)  => {
  let client_username = client.parser.settings.username;
  let client_password;
  if (client.parser.settings.password != null) {
    //toString() is required because password is typically sent as a buffer.
    client_password = client.parser.settings.password.toString();
  }
  console.log(`Authentication Attempted - ${client_username} - ${client_password}`);
  if (username === client_username && password === client_password && client_password != null) {
    callback(null, username);
    console.log("Authentication Success!");
    console.log(`Successful Connection: ${client.id}`);
    console.log(`Total Connections: ${aedes.connectedClients}`);
    connectedClients.push(client.id);
    console.log(connectedClients);

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
mqtt_server.listen(mqttPort, async function () {
  console.log('MQTT client started and listening on port ', mqttPort);
});

aedes.on('client', async function(client) {
  // console.log(client);
});

aedes.on('subscribe', async function(topic , deliverfunc) {
  console.log("Successful Subscription: ");
  console.log(topic[0]);
});

aedes.on('clientReady', async function(device) {
  //'clientReady' is before authentication, better to do it on successful auth.
});

aedes.on('publish', async function(packet, client) {
  //console.log('Something Published:');
  if (client != null) {
    //console.log(`Client: ${client.id}`);
  }
  //console.log(`Topic: ${packet.topic} - Message: ${packet.payload}`);
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
});


let vol = 0;

setInterval(() => {
  if (vol <= 100-3) {
    vol+=3;
  } else {
    vol = 0;
  }
  client.publish("python/test", Buffer.from(`${vol}`));
},1000)

setTimeout(() => {
  client.publish("python/test2", `asdiubasiofnaspgkmasdfgnas`);
},10000);
