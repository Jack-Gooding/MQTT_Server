//
//
// This script is intended to be run on a remote, always-on host (AWS EC2 instance or Azure similar would be suitable.)

const mqtt = require('mqtt'); //MQTT protocols
const aedes = require('aedes')(); //MQTT Server Host
const fs = require('fs'); //required for reading SSL/TLS certs.

//const mqtt_server = require('net').createServer(aedes.handle);

//Key Certs should be used.
// const options = {
//   key: fs.readFileSync('YOUR_PRIVATE_KEY_FILE.pem'),
//   cert: fs.readFileSync('YOUR_PUBLIC_CERT_FILE.pem')
// }

const mqttPort = 1883;
const mqttsPort = 8883;

let connectedClients = [];

const mqtts_server = require('tls').createServer(options, aedes.handle);


const client  = mqtt.connect('mqtt:/localhost', {
    clientId: "MQTT_Host",
});

client.on('connect', async () => {
  client.subscribe('devices/request');
});

client.on('message', async (topic, msg) => {
  message = msg.toString('utf8');
  if (topic === 'devices/request') {
    client.publish('clients/connected', JSON.stringify({clients: connectedClients}));
  };
});

mqtts_server.listen(mqttsPort, async function () {
  console.log('MQTT client started and listening on port ', mqttsPort);
})

aedes.on('subscribe', async function(topic , deliverfunc) {
  console.log("Successful Subscription: ");
  console.log(topic);
  client.publish('subscription/topic',topic);
});

aedes.on('clientReady', async function(device) {
  console.log(`Successful Connection: ${device.id}`);
  console.log(`Total Connections: ${aedes.connectedClients}`);
  connectedClients.push(device.id);
  console.log(connectedClients);
  client.publish('clients/connected', JSON.stringify({clients: connectedClients}));
});

aedes.on('publish', async function(packet, client) {
  console.log('Something Published:');
  console.log(`Packet:`);
  console.log(packet);
  console.log(`Client:`);
  console.log(client);
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
