const path = require('path');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)
const {client} = require('./MQTT');


const getAHT10Data = async function getAHT10Data () {
  // Exec output contains both stderr and stdout outputs
  let data = await exec(`python3 ${path.join(__dirname, 'RaspiAHT10.py')}`)

  data = JSON.parse(data.stdout.trim());
  console.log(data);
  //sent as array for easier parsing with ds18x20 values.
  client.publish(`broker/temperatures`, JSON.stringify([data]));

  return data;
};


module.exports = {
  getAHT10Data
}
