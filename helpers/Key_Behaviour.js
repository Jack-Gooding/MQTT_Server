
const hueHelpers = require("./Philips_Hue");
const tpLinkHelpers = require("./TPLink");
const ws2812B = require("./WS2812B");
const custom = require("./Custom_Devices");
const blinds = require("./blinds");


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
];

const switches_on = [
  {
    shortPress: function() {
      tpLinkHelpers.toggle(0,true);
      tpLinkHelpers.toggle(1,true);
      custom.setScreenLights("255");
    },
    longPress: function() {
      tpLinkHelpers.toggle(0,true);
      tpLinkHelpers.toggle(1,true);
      custom.setScreenLights("255");
    },
    longerPress: function() {
      tpLinkHelpers.toggle(0,true);
      tpLinkHelpers.toggle(1,true);
      custom.setScreenLights("255");
    },
  },
]

const switches_off = [
  {
    shortPress: function() {
      tpLinkHelpers.toggle(0,false);
      tpLinkHelpers.toggle(1,false);
      custom.setScreenLights("0");
    },
    longPress: function() {
      tpLinkHelpers.toggle(0,false);
      tpLinkHelpers.toggle(1,false);
      custom.setScreenLights("0");
    },
    longerPress: function() {
      tpLinkHelpers.toggle(0,false);
      tpLinkHelpers.toggle(1,false);
      custom.setScreenLights("0");
    },
  },
]


const leds = [
  {
    shortPress: function() {ws2812B.randomiseColours()},
    longPress: function() {ws2812B.randomiseColours(true)},
    longerPress: function() {ws2812B.randomiseColours()}
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

module.exports = {
  lights_up,
  lights_down,
  light_up,
  light_down,
  switches_on,
  switches_off,
  switch_on,
  switch_off,
  leds,
  blinds_up,
  blinds_down,
}
