const mqtt = require('mqtt'); //MQTT protocols

require('dotenv').config();
const username = process.env.USERN;
const password = process.env.PASS;



let attemptConnection = () => {
  try {
    let client = mqtt.connect('mqtts://jack-gooding.com', {
      port: 8883,
      clientId: "Home Server",
      username: username,
      password: password
    });
    if (client) {
	console.log(`connection successful!`);
}
    return client;
  }
  catch(e) {
    console.log(e);
    setTimeout(() => {
      return attemptConnection();
    },3000);
  }
}

const client = attemptConnection();

client.on('connect', () => {
  client.subscribe('device/connected');
  client.subscribe('clients/connected');
  client.subscribe('keypad/button/pressed');
  client.subscribe('keypad/button/released');

  client.subscribe('lights/request');
  client.subscribe('lights/update');
  client.subscribe('plugs/update');
  client.subscribe('plugs/request');
  client.subscribe('temperature/request');
  client.subscribe('ring/warm');
  // client.subscribe('bedroom/blinds');

  // client.subscribe('test/on');
  // client.subscribe('test/num');
  // client.subscribe('desk/lights');

  // client.subscribe('rpi/motion');

  client.subscribe('ifttt/home');
});
/*
mqtt_server.listen(mqttPort, function () {
  //console.log('MQTT mqtt started and listening on port ', mqttPort)
})

aedes.on('subscribe', function(topic , deliverfunc) {
  console.log("Successful Subscription: ");
  console.log(topic);
});

aedes.on('clientReady', function(device) {
  console.log(`Successful Connection: ${device.id}`);
  console.log(`Total Connections: ${aedes.connectedClients}`);
  connectedClients.push(device.id);
  client.publish('clients/connected', JSON.stringify({clients: connectedClients}));
});

aedes.on('clientDisconnect', function(device) {
  console.log(`Client Disconnected: ${device.id}`);
  console.log(`Total Connections: ${aedes.connectedClients}`);
  for (let i = connectedClients.length-1; i >= 0; i--) {
    if (device.id == connectedClients[i]) {
      connectedClients.splice(i, 1);
    }
  }
  console.log(connectedClients);
  client.publish('clients/connected', JSON.stringify({clients: connectedClients}));
});*/

module.exports = {client};
