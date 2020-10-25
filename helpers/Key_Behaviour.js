
const hueHelpers = require("./Philips_Hue");
const tpLinkHelpers = require("./TPLink");
const ws2812B = require("./WS2812B");
const custom = require("./Custom_Devices");
const blinds = require("./Blinds");


const {client} = require("./MQTT");

const lights_up = [
  {
    shortPress: function(count) {hueHelpers.toggleLights(true)},
    longPress: function(count) {hueHelpers.randomiseLights()},
    longerPress: function(count) {hueHelpers.changeBrightness(254/10)}
  },
];

const lights_down = [
  {
    shortPress: function(count) {hueHelpers.toggleLights(false)},
    longPress: function(count) {hueHelpers.randomiseLights()},
    longerPress: function(count) {hueHelpers.changeBrightness(-254/10)}
  },
];

const light_up = [
  {
    shortPress: function(count) {hueHelpers.toggleLights(true, count)},
    longPress: function(count) {hueHelpers.randomiseLights(count)},
    longerPress: function(count) {hueHelpers.changeBrightness(254/10, count)}
  },
];

const light_down = [
  {
    shortPress: function(count) {hueHelpers.toggleLights(false, count)},
    longPress: function(count) {hueHelpers.randomiseLights(count)},
    longerPress: function(count) {hueHelpers.changeBrightness(-254/10, count)}
  },
];

const switch_on = [
  {
    shortPress: function() {tpLinkHelpers.toggle(0,true)},
    longPress: function() {tpLinkHelpers.toggle(0,true)},
    longerPress: function() {tpLinkHelpers.toggle(0,true)}
  },
  {
    shortPress: function() {tpLinkHelpers.toggle(1,true)},
    longPress: function() {tpLinkHelpers.toggle(1,true)},
    longerPress: function() {tpLinkHelpers.toggle(1,true)}
  },
  {
    shortPress: function() {custom.setScreenLights("255")},
    longPress: function() {custom.setScreenLights("255")},
    longerPress: function() {custom.setScreenLights("255")}
  },
  {
    shortPress: function() {custom.setRPiLights("255")},
    longPress: function() {custom.setRPiLights("255")},
    longerPress: function() {custom.setRPiLights("255")}
  },
]

const switch_off = [
  {
    shortPress: function() {tpLinkHelpers.toggle(0,false)},
    longPress: function() {tpLinkHelpers.toggle(0,false)},
    longerPress: function() {tpLinkHelpers.toggle(0,false)}
  },
  {
    shortPress: function() {tpLinkHelpers.toggle(1,false)},
    longPress: function() {tpLinkHelpers.toggle(1,false)},
    longerPress: function() {tpLinkHelpers.toggle(1,false)}
  },
  {
    shortPress: function() {custom.setScreenLights("0")},
    longPress: function() {custom.setScreenLights("0")},
    longerPress: function() {custom.setScreenLights("0")}
  },
  {
    shortPress: function() {custom.setRPiLights("0")},
    longPress: function() {custom.setRPiLights("0")},
    longerPress: function() {custom.setRPiLights("0")}
  },
];

const switches_on = [
  {
    shortPress: function() {
      tpLinkHelpers.toggle(0,true);
      tpLinkHelpers.toggle(1,true);
      custom.setScreenLights("255");
      custom.setRPiLights("255");
    },
    longPress: function() {
      tpLinkHelpers.toggle(0,true);
      tpLinkHelpers.toggle(1,true);
      custom.setScreenLights("255");
      custom.setRPiLights("255");
    },
    longerPress: function() {
      tpLinkHelpers.toggle(0,true);
      tpLinkHelpers.toggle(1,true);
      custom.setScreenLights("255");
      custom.setRPiLights("255");
    },
  },
]

const switches_off = [
  {
    shortPress: function() {
      tpLinkHelpers.toggle(0,false);
      tpLinkHelpers.toggle(1,false);
      custom.setScreenLights("0");
      custom.setRPiLights("0");
    },
    longPress: function() {
      tpLinkHelpers.toggle(0,false);
      tpLinkHelpers.toggle(1,false);
      custom.setScreenLights("0");
      custom.setRPiLights("0");
    },
    longerPress: function() {
      tpLinkHelpers.toggle(0,false);
      tpLinkHelpers.toggle(1,false);
      custom.setScreenLights("0");
      custom.setRPiLights("0");
    },
  },
]



const leds_on = [
  {
    shortPress: function() {ws2812B.randomiseColours()},
    longPress: function() {ws2812B.randomiseColours(true)},
    longerPress: function() {ws2812B.randomiseColours()},
  },
  {
    shortPress: function() {ws2812B.rainbowRing()},
    longPress: function() {ws2812B.rainbowRing(true)},
    longerPress: function() {ws2812B.rainbowRing()},
  },
  {
    shortPress: function() {ws2812B.ringWarm()},
    longPress: function() {ws2812B.ringWarm()},
    longerPress: function() {ws2812B.ringWarm()},
  },
];

const leds_off = [
  {
    shortPress: function() {client.publish("keypad/leds", ws2812B.allOff())},
    longPress: function() {client.publish("keypad/leds", ws2812B.allOff())},
    longerPress: function() {client.publish("keypad/leds", ws2812B.allOff())}
  },
  {
    shortPress: function() {ws2812B.ringOff()},
    longPress: function() {ws2812B.ringOff(true)},
    longerPress: function() {ws2812B.ringOff()}
  },
  {
    shortPress: function() {ws2812B.ringOff()},
    longPress: function() {ws2812B.ringOff(true)},
    longerPress: function() {ws2812B.ringOff()}
  },
];

const blinds_up = [
  {
    shortPress: function(count) {blinds.setPosition(count, "up")},
    longPress: function(count) {blinds.setPosition(count, "up")},
    longerPress: function(count) {blinds.setPosition(count, "up")}
  },
]

const blinds_down = [
  {
    shortPress: function(count) {blinds.setPosition(count, "down")},
    longPress: function(count) {blinds.setPosition(count, "down")},
    longerPress: function(count) {blinds.setPosition(count, "down")}
  },
]

const keyboard_up = [
  {
    shortPress: function(count) {client.publish("keyboard/key","play")},
    longPress: function(count) {client.publish("keyboard/key","next")},
    longerPress: function(count) {client.publish("keyboard/key","vol_up")}
  },
]

const keyboard_down = [
  {
    shortPress: function(count) {client.publish("keyboard/key","mute")},
    longPress: function(count) {client.publish("keyboard/key","prev")},
    longerPress: function(count) {client.publish("keyboard/key","vol_down")}
  },
]

module.exports = {
  lights_up,
  lights_down,
  light_up,
  light_down,
  switches_on,
  switches_off,
  switch_on,
  switch_off,
  leds_on,
  leds_off,
  blinds_up,
  blinds_down,
  keyboard_up,
  keyboard_down,
}
