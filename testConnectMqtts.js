const mqtt = require('mqtt'); //MQTT protocols
const blinds = require('./helpers/Blinds.js');
const client  = mqtt.connect('mqtts://jack-gooding.com', {
    port: 8883,
    clientId: "Test Connect S",
    username: "John",
});

client.on('connect', async () => {
  console.log("Connected");
  client.subscribe('device/connected');
  client.subscribe('clients/connected');
  client.subscribe('keypad/button/pressed');
  client.subscribe('keypad/button/released');
  client.subscribe('bedroom/blinds');

  client.subscribe('test/on');
  client.subscribe('test/num');
  client.subscribe('desk/lights');

  client.subscribe('rpi/motion');

  client.subscribe('ifttt/home');
  let package = await blinds.setPosition("60000", "down");
  client.publish('bedroom/blinds', package);
});

client.on('message', async (topic, msg) => {
  message = msg.toString('utf8');
  console.log(topic, message);
});
