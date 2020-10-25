
//DS18B20 Temperature Sensor, 1-Wire
var sensor = require('ds18x20');

var tempObj = sensor.getAll();
console.log(tempObj);


var temp = sensor.get('28-0316c2c8bbff');
console.log(temp);
