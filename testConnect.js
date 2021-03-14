const mqtt = require('mqtt'); //MQTT protocols

require('dotenv').config();
const username = process.env.USERN;
const password = process.env.PASS;

let attemptConnection = () => {
  try {
    let client = mqtt.connect('mqtts://jack-gooding.com', {
      port: 8883,
      clientId: "Test Script",
      username: username,
      password: password
    });



client.on('connect', async () => {
  client.subscribe('device/connected');
  client.subscribe('clients/connected');
  client.subscribe('keypad/button/pressed');
  client.subscribe('keypad/button/released');
  console.log('connecttttttttt');
});

client.on('message', async (topic, msg) => {
  message = msg.toString('utf8');
  console.log(topic, message);
});

client.on('error', async (error) => {
  console.log(error);
});

  return client;
  }
  catch(e) {
    console.log(`Failed to connect to MQTT.`)
    console.log(e);
    setTimeout(() => {
      return attemptConnection();
    },3000);
  }
};

let client = attemptConnection();
