const axios = require("axios");
//const {client} = require("./MQTT");

const getPosition = async function() {

};

const setPosition = async function(count, dir) {
  steps = count * 10000;
  package = JSON.stringify({steps: steps, dir: dir});
  return package;
};

module.exports = {
  getPosition,
  setPosition,
}
