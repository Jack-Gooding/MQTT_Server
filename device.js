var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://192.168.1.68', { will: { topic: 'death', payload: 'me' } });

/*
* The state of the device, defaults to off
* Possible states : off, on
*/

let state = "off";

client.on('connect', () => {

  // Inform controllers that device is connected
  client.publish('device/connected', 'true');


  client.subscribe('device/on', {qos: 2, rh: true}, function(err, granted) {
    if (!err && granted) {
      console.log(`Succesfully subscribed device/on`);
      //console.log(granted);
    }
  });

});

client.on('message', (topic, message) => {
  message = message.toString();
  console.log('received message, topic: %s, message: %s', topic, message);
  if (topic === 'device/on') {
    if (message == "off" || message == "on") {
      state = message;
    }
    sendStateUpdate();
  } else {
    sendErrorMessage();
  }
})

function sendStateUpdate () {
  console.log('Sending state: %s', state)
  client.publish('device/state', state, {retain: true, qos: 2});
}

function sendErrorMessage() {
  console.log('unrecognised update, sending error');
  client.publish('device/error', "device, unexpected command");
}

setInterval(function() {
  client.publish("device/on", (state == "off") ? "on" : "off");
},5000);
