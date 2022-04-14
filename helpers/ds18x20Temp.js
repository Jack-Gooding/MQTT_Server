//DS18B20 Temperature Sensor, 1-Wire
let sensor = require('ds18x20');
const {client} = require('./MQTT');

let sensors = [];

let obtainSensors = () => {
  let tempObj = sensor.getAll();
  sensors = Object.keys(tempObj);
};

let readTemperatures = () => {
  if (sensors.length == 0 || sensors != null) {
    obtainSensors();
  }
  let temps = [];

  sensors.forEach((thermistor) => {
    let reading = sensor.get(thermistor);
    //console.log(`${thermistor}: ${reading}`);
    let temp = {
      id: thermistor,
      location: 'Raspberry Pi 3B+ Ds18x20',
      temp: reading,
    }
    temps.push(temp);
  });

  client.publish(`broker/temperatures`, JSON.stringify(temps));
  console.log(temps);
  return temps;
}

obtainSensors();
//readTemperatures();

module.exports = {
  sensors,
  obtainSensors,
  readTemperatures
}
