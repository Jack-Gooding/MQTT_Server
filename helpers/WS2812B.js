const {client} = require('./MQTT'); //MQTT protocols

//state store for custom WS2812B
let ledStore = [{
  red: Math.floor(Math.random()*255),
  green: Math.floor(Math.random()*255),
  blue: Math.floor(Math.random()*255),
},{
  red: Math.floor(Math.random()*255),
  green: Math.floor(Math.random()*255),
  blue: Math.floor(Math.random()*255),
},{
  red: Math.floor(Math.random()*255),
  green: Math.floor(Math.random()*255),
  blue: Math.floor(Math.random()*255),
}];



let randomiseColours = function(all) {
  if (all) {
    let red = Math.floor(Math.random()*255);
    let green = Math.floor(Math.random()*255);
    let blue = Math.floor(Math.random()*255);

    ledStore.forEach(function(led) {
      led.red = red;
      led.green = green;
      led.blue = blue;
    });
  } else {

    ledStore.forEach(function(led) {
      led.red = Math.floor(Math.random()*255);
      led.green = Math.floor(Math.random()*255);
      led.blue = Math.floor(Math.random()*255);
    });

  };
  let leds = [...ledStore];
  console.log(ledStore);
  leds = JSON.stringify({leds});
  console.log(leds);
  client.publish('keypad/leds', leds);
};

let allOff = function() {
    ledStore.forEach(function(led) {
      led.red = 0;
      led.green = 0;
      led.blue = 0;
    });

    let leds = [...ledStore];
    leds = JSON.stringify({leds});
    client.publish('keypad/leds', leds);
};

let shortIndicator = async function() {

  leds = JSON.stringify({leds: [{red: 0, blue: 254, green: 254}]});
  client.publish('keypad/leds', leds);
};

let longIndicator = async function() {

  leds = JSON.stringify({leds: [{red: 0, blue: 0, green: 0},{red: 0, blue: 254, green: 254}]});
  client.publish('keypad/leds', leds);
};

let longerIndicator = async function() {

  leds = JSON.stringify({leds: [{red: 0, blue: 0, green: 0},{red: 0, blue: 0, green: 0},{red: 0, blue: 254, green: 254}]});
  client.publish('keypad/leds', leds);
};

let layerIndidicator = async function() {
    let leds = [];

    ledStore.forEach((led) => {
      leds.push({
        red : 254,
        green: 254,
        blue: 254,
      });
    });

    leds = JSON.stringify({leds});
    console.log(ledStore);
    console.log(leds);
    client.publish('keypad/leds', leds);
};

let releaseIndicator = async function() {
  let leds = [...ledStore];
  leds = JSON.stringify({leds});
  console.log(ledStore);
  console.log(leds);
  client.publish('keypad/leds', leds);
};

module.exports = {
  randomiseColours,
  allOff,
  ledStore,
  shortIndicator,
  longIndicator,
  longerIndicator,
  releaseIndicator,
  layerIndidicator,
};
