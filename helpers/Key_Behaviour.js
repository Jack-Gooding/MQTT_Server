
const hueHelpers = require("./Philips_Hue");
const tpLinkHelpers = require("./TPLink");
const ws2812B = require("./WS2812B");
const custom = require("./Custom_Devices");

const {client} = require("./MQTT");

const light_up = [
  {
    shortPress: function() {hueHelpers.toggleLights(true)},
    longPress: function() {hueHelpers.randomiseLights()},
    longerPress: function() {hueHelpers.changeBrightness(254/10)}
  },
];

const light_down = [
  {
    shortPress: function() {hueHelpers.toggleLights(false)},
    longPress: function() {hueHelpers.randomiseLights()},
    longerPress: function() {hueHelpers.changeBrightness(-254/10)}
  },
];

const switches_on = [
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
    shortPress: function(state) {custom.setScreenLights(state)},
    longPress: function(state) {custom.setScreenLights(state)},
    longerPress: function(state) {custom.setScreenLights(state)}
  },
]

const switches_off = [
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
    shortPress: function(state) {custom.setScreenLights(state)},
    longPress: function(state) {custom.setScreenLights(state)},
    longerPress: function(state) {custom.setScreenLights(state)}
  },
];


const leds = [
  {
    shortPress: function() {ws2812B.randomiseColours()},
    longPress: function() {ws2812B.randomiseColours(true)},
    longerPress: function() {ws2812B.randomiseColours()}
  },
];


module.exports = {
  light_up,
  light_down,
  switches_on,
  switches_off,
  leds,
}
