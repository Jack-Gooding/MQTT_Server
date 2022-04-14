//DS18B20 Temperature Sensor, 1-Wire
let sensor = require('ds18x20');
const {client} = require('./MQTT');

const os = require('os');

let sensors = [];

let obtainSensors = () => {
  // console.log(os.arch());
  // console.log(os.version());

  if (os.platform() === "linux") {
    console.log(os.platform());

      console.log(isLoaded);
      let tempObj = sensor.getAll();
      sensors = Object.keys(tempObj);

  };
};

let readTemperatures = () => {
  let temps = [];


  if (os.platform() === "linux") {


  if (sensors.length == 0 || sensors != null) {
    obtainSensors();
  }

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
  };

  return temps;
}

obtainSensors();
//readTemperatures();

module.exports = {
  sensors,
  obtainSensors,
  readTemperatures
}
