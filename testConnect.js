const mqtt = require('mqtt'); //MQTT protocols

const client  = mqtt.connect('mqtt://jack-gooding.com', {
    port: 1883,
    clientId: "Home Server",
});

client.on('connect', () => {
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
});

client.on('message', async (topic, msg) => {
  message = msg.toString('utf8');
  console.log(topic, message);
});
