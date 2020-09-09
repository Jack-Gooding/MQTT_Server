const {client} = require('./MQTT'); //MQTT protocols

//State management for custom devices
let screenLights = false;

let rpiLights = false;

let setScreenLights = async (state) => {
    screenLights = state;
    client.publish('desk/lights', state);
    return screenLights;
};

let setRPiLights = async (state) => {
    rpiLights = state;
    client.publish('rpi/ledString', state);
    return rpiLights;
};



module.exports = {
  screenLights,
  setScreenLights,
  setRPiLights,
}
