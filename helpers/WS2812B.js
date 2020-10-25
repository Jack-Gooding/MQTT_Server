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



let randomiseColours = async function(all) {
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

let allOff = async function() {
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
    // console.log(ledStore);
    // console.log(leds);
    client.publish('keypad/leds', leds);
};

let releaseIndicator = async function() {
  let leds = [...ledStore];
  leds = JSON.stringify({leds});
  // console.log(ledStore);
  // console.log(leds);
  client.publish('keypad/leds', leds);
};

let rainbowRing = () => {

  let leds = {
    mode: "HSV", // || RGB
    anim: "rotate",
    inter: 1000/24,
    leds: [],
  };

  // for (let i = 0; i < 24; i++) {
  //   leds.leds.push([
  //       Math.floor(Math.random()*255),
  //       Math.floor(Math.random()*255),
  //       Math.floor(Math.random()*255),
  //     ]
  //   );
  // }
  let randoOffset = Math.floor(Math.random()*255);
  let randoSat = Math.floor(Math.random()*255);
  let randoBri = Math.floor(Math.random()*255);
  for (let i = 0; i < 24; i++) {
    leds.leds.push([
        Math.floor(255/24*i+randoOffset),
        255,
        255,
      ]
    );
  }




  leds = JSON.stringify(leds);
  // leds = JSON.stringify({leds: [{red: Math.random()*255, blue: 0, green: 0}]});
  console.log(leds);
  console.log(leds.length);
  client.publish("neopixel/ring/leds", leds);

};

let ringOff = () => {

  let leds = {
    mode: "HSV", // || RGB
    anim: "none",
    inter: 1000/24,
    leds: [],
  };

  for (let i = 0; i < 24; i++) {
    leds.leds.push([
        0,
        0,
        0,
      ]
    );
  }




  leds = JSON.stringify(leds);
  client.publish("neopixel/ring/leds", leds);

};

let ringWarm = async () => {

  let leds = {
    mode: "HSV", // || RGB
    anim: "rotate",
    inter: 1000/12,
    leds: [],
  };

  let chance = Math.round(Math.random());
  let hue = Math.round(Math.random()*255);
  for (let i = 0; i < 24; i++) {
    let bri = ((i+1)/24)*Math.PI/3;
    console.log(bri);
    let sat = ((i+1)/24)*Math.PI/3;
    bri = Math.round(bri*255);
    sat = Math.round(255*sat);
    leds.leds.push([
        chance ? (hue+sat)%255 : 80,
        chance ? 255 : sat,
        bri,
      ]
    );
  }




  leds = JSON.stringify(leds);
  client.publish("neopixel/ring/leds", leds);

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
  rainbowRing,
  ringOff,
  ringWarm
};
