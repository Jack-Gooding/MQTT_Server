const express = require('express');
const bodyParser = require('body-parser');
const uuidv1 = require('uuid/v1');
const uuidv3 = require('uuid/v3');
const uuidv4 = require('uuid/v4');

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://192.168.1.107');

client.on('connect', () => {
  // Inform controllers that garage is connected
  client.publish('garage/connected', 'true')
})






console.log(uuidv4()); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const app = express();

const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
console.log(uuidv3('Hello, World!', MY_NAMESPACE)); // ⇨ 'e8b5a51d-11c8-3310-a6ab-367563f20686'

const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {    console.log('We are live on ' + port);  });
