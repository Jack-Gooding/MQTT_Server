// const {client} = require('./MQTT'); //MQTT protocols

//State management for custom devices
let screenLights = false;

let rpiLights = false;

let setScreenLights = function(state) {
    screenLights = state;
    return screenLights;
    // client.publish('desk/lights', state);
};

let setRPiLights = function(state) {
    rpiLights = state;
    return rpiLights;
    // client.publish('rpi/ledString', state);
};



module.exports = {
  screenLights,
  setScreenLights,
  setRPiLights,
}
