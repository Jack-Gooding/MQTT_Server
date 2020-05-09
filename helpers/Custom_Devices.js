const {client} = require('./MQTT'); //MQTT protocols

//State management for custom devices
let screenLights = false;

let setScreenLights = function(state) {
    screenLights = state;
    client.publish('desk/lights', state);
};

let setRPiLights = function(state) {
    screenLights = state;
    client.publish('rpi/ledString', state);
};



module.exports = {
  screenLights,
  setScreenLights,
  setRPiLights,
}
