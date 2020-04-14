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
  let leds = ledStore;
  leds = JSON.stringify({leds});
  client.publish('keypad/leds', leds);
};

let allOff = function() {
      ledStore.forEach(function(led) {
        led.red = 0;
        led.green = 0;
        led.blue = 0;
      });

    let leds = ledStore;
    leds = JSON.stringify({leds});
    client.publish('keypad/leds', leds);
};

let shortIndicator = function() {
  let leds = ledStore;
      leds[0].red = 0;
      leds[0].green = 254;
      leds[0].blue = 0;
      leds = JSON.stringify({leds});
      client.publish('keypad/leds', leds);
};

let longIndicator = function() {
  let leds = ledStore;
      leds[0].red = 150;
      leds[0].green = 254;
      leds[0].blue = 0;
      leds = JSON.stringify({leds});
      client.publish('keypad/leds', leds);
};

let longerIndicator = function() {
  let leds = ledStore;
      leds[0].red = 150;
      leds[0].green = 254;
      leds[0].blue = 100;
      leds = JSON.stringify({leds});
      client.publish('keypad/leds', leds);
};

let releaseIndicator = function() {
  let leds = ledStore;
    //return JSON.stringify({leds});
  leds = JSON.stringify({leds});
  client.publish('keypad/leds', leds);
};

module.exports = {
  randomiseColours,
  allOff,
  shortIndicator,
  longIndicator,
  longerIndicator,
  releaseIndicator,
};
