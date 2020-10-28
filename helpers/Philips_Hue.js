const v3 = require('node-hue-api').v3;
const {client} = require('./MQTT');
const LightState = v3.lightStates.LightState;
let discovery = v3.discovery;
let hueApi = v3.api;
let hueBridgeLocation;
let hueBridge;
let lights = [];

let disco;
let discoActive = false;

let rainbowInterval;
let rainbowActive = false;

const username = "8FNEwdPyoc9eVRxP7ukCnf4QFowMK2aoHOmBuJdi";

async function discoverBridge() {
  try {
    const discoveryResults = await discovery.nupnpSearch();
    if (discoveryResults.length === 0) {
      console.error('Failed to resolve any Hue Bridges');
      return null;
    } else {
      // Ignoring that you could have more than one Hue Bridge on a network as this is unlikely in 99.9% of users situations
      console.log(`Found ${discoveryResults.length} bridge(s): ${discoveryResults[0].ipaddress}`)
      return discoveryResults[0].ipaddress;
    }
  }
  catch(e) {
    console.error(e);
  }
}

updateLights = async (newLights) => {
  if (newLights != null) {
    lights = newLights;
  } else {
    lights = await hueBridge.lights.getAll();
  }

  let lightStates = [];

  for (let i = 0; i < lights.length; i++) {
    let light = lights[i];

    let lightState = await hueBridge.lights.getLightState(light._data.id);

    let stateObj = {
      name: light._data.name,
      id: light._data.id,
      type: light._data.type,
      on: lightState.on,
      reachable: lightState.reachable,
      color: {
        bri: lightState.bri,
      },
    }

    if (light._data.type === "Extended color light") {

      stateObj.color.hue = lightState.hue;
      stateObj.color.sat = lightState.sat;

    };

    lightStates.push(stateObj);
  }

  client.publish('broker/lights', JSON.stringify(lightStates));
};

prepareHue = async () => {
  try {
    hueBridgeLocation = await discoverBridge();
    hueBridge =  await hueApi.createLocal(hueBridgeLocation).connect(username);
    let newLights = await hueBridge.lights.getAll();
    await updateLights(newLights);
    console.log(`Found ${lights.length} Lights!`);
    return lights;
  }
  catch(e) {
    console.log(e);
  }
};

//prepareHue();


async function randomiseLights(lightId) {
  console.log("randomiseLights");
  //console.log(hueApi);
  let changes = [];
  if (lights) {
    //console.log(hueApi);
    //console.log(lights);
    let promises = [];
    let state;

    if (lightId > lights.length-1) {
      lightId = lights.length-1;
    };
    if (lightId != null) {
      let light = lights[lightId];

      if (light._data.type === "Extended color light") {
        state = new LightState().transition(0).hue(Math.random()*65535).sat(Math.random(254/2)+(254/2)).on();
      } else {
        state = new LightState().transition(0).on();
      }
      promises.push(hueBridge.lights.setLightState(light._data.id, state));

    } else {
      for (let i = 0; i < lights.length; i++ ) {

        let light = lights[i];
        if (light._data.type === "Extended color light") {

          let hue = Math.round(Math.random()*360);
          let sat = 100;
          let lightness = 50;
          let change = {
            name: light._data.name,
            color: {
              hue: hue,
              sat: sat,
              lightness: lightness,
            },
          };
          state = new LightState().transition(0).hsl(hue,sat,lightness).on();
          changes.push(change);
        } else {
          state = new LightState().transition(0).on();
        }
        promises.push(hueBridge.lights.setLightState(light._data.id, state));
      };
    };
    let promise = await Promise.all(promises);
    console.log(`Randomise Promise: `);
    console.log(promise);
    console.log(changes);

    updateLights(); //Request new light data

    return changes;
    //console.log(hueApi.lights.getAll());
  } else {
    await prepareHue();
    randomiseLights();
  };
};

async function rainbowLoop(transition = 4) {
  if (lights) {
    if (!rainbowActive) {
      rainbowInterval = setInterval(async function() {
        console.log(`Starting Lights: Rainbow mode!`);
        let promises = [];

          for (let i = 0; i < lights.length; i++ ) {

            let light = lights[i];
            if (light._data.type === "Extended color light") {
              let change = {
                hue: 65534/2,
                name: light._data.name,
              };
              state = new LightState().transition(transition*1000).hue_inc(change.hue).sat(254).on();
              promises.push(hueBridge.lights.setLightState(light._data.id, state));
            }
          };

        let promise = await Promise.all(promises);

      }, transition*1000);
    } else {
      clearInterval(rainbowInterval);
    }
    rainbowActive = !rainbowActive;

    updateLights(); //Request new light data

    return rainbowActive;
  } else {
    await prepareHue();
    return rainbowLoop();
  }
};

async function discoLights(transition = 2) {

  if (lights) {
    if (!discoActive) {
      console.log(`Disco request received.`);
      disco = setInterval(async function() {
        console.log(`Randomising Lights: Disco mode!`);
        let promises = [];

          for (let i = 0; i < lights.length; i++ ) {

            let light = lights[i];
            if (light._data.type === "Extended color light") {
              let change = {
                hue: Math.random()*65534,
                name: light._data.name,
              };
              state = new LightState().transition(transition*1000).hue(change.hue).sat(254).on();
              promises.push(hueBridge.lights.setLightState(light._data.id, state));
            } else {
              //Do nothing because you might want a dim disco
              // state = new LightState().on().transition(transition*1000).brightness(Math.random()*30+70);

            };
          };

        let promise = await Promise.all(promises);

      }, transition*1000);
    } else {
      clearInterval(disco);
    }
    discoActive = !discoActive;

    updateLights(); //Request new light data

    return discoActive;
  } else {
     await prepareHue();
     return discoLights();
  };
};

async function getLightStates(lightId) {
  let states = [];
  if (lightId != null) {

    let lightState = await hueBridge.lights.getLightState(lightId);
    states.push(lightState);

  } else {

    for (let i = 0; i < lights.length; i++) {
      let light = lights[i];

      let lightState = await hueBridge.lights.getLightState(light._data.id);

      let stateObj = {
        name: light._data.name,
        id: light._data.id,
        type: light._data.type,
        on: lightState.on,
        reachable: lightState.reachable,
        color: {
          bri: lightState.bri,
        },
      }

      if (light._data.type === "Extended color light") {

        stateObj.color.hue = lightState.hue;
        stateObj.color.sat = lightState.sat;

      };

      states.push(stateObj);
    }
  }
  console.log(states);

  updateLights(); //Request new light data

  return states;
}

//Intended is true/false
//ligthId = integer
async function toggleLights(intended, lightId) {
  console.log(`LightId: ${lightId}`);

  if (lights) {

  let promises = [];

  if (lightId != null) {

    light = lights.find((light) => light.id == lightId);
    if (!intended) {
      state = new LightState().transition(200).off();
    } else {
      if (light._data.type == "Extended color light") {
        state = new LightState().transition(500).ct(Math.random()*(500-153)+153).on();
      } else {
        state = new LightState().transition(500).on();
      }
    }
    promises.push(hueBridge.lights.setLightState(light._data.id, state));

  } else {

        for (let i = 0; i < lights.length; i++ ) {
          let light = lights[i];
          let lightState = await hueBridge.lights.getLightState(light._data.id);
          let state;


          if (!intended) {
            state = new LightState().transition(200).off();
          } else {
            state = new LightState().transition(500).ct(Math.random()*(500-153)+153).on();
          }
          promises.push(hueBridge.lights.setLightState(light._data.id, state));
        };
  }
  let promise = await Promise.all(promises);
  updateLights(); //Request new light data
  //console.log(hueApi.lights.getAll());
} else {
  await prepareHue();
  turnLightsOff();
};
};


async function changeLightBrightness(direction, interval, light = null) {
  let promises = [];
  for (let i = 0; i < lights.length; i++ ) {
    let light = lights[i];
    let lightState = await hueBridge.lights.getLightState(light._data.id);
    let state;

    //console.log(lightState);
    console.log(`${lightState.bri}`);
    if (lightState.on) {
      if (lightState.bri > 1+interval) {
        state = new LightState().transition(500).bri(lightState.bri-interval).on();
        promises.push(hueBridge.lights.setLightState(light._data.id, state));
        console.log("tell me this is triggered");
      } else if (lightState.bri > 0 && lightState.bri < 1+interval) {
        state = new LightState().transition(500).bri(1).on();
        promises.push(hueBridge.lights.setLightState(light._data.id, state));
        console.log("finally 0")
      } else {
        console.log("0 reached");
      }
    }
    promises.push(hueBridge.lights.setLightState(light._data.id, state));
  };
  let promise = await Promise.all(promises);
  updateLights(); //Request new light data
};

  //changes brightness by {amount}, -254 -> 254
async function changeBrightness(amount, lightId) {

  let promises = [];

  if (lightId != null) {
    let state;
    let light = lights.find((light) => light.id == lightId);

    state = new LightState().transition(400).bri_inc(amount);

    promises.push(hueBridge.lights.setLightState(light._data.id, state));
  } else {

    for (let i = 0; i < lights.length; i++ ) {
      let state;
      let light = lights[i];

      state = new LightState().transition(400).bri_inc(amount);

      promises.push(hueBridge.lights.setLightState(light._data.id, state));
    };
  };
  let promise = await Promise.all(promises);
  updateLights(); //Request new light data
};

//set brightness to a new value 0 -> 254
async function setColorValues(color, lightId) {

let promises = [];

if (lightId != null) {
  let state;
  let light = lights.find((light) => light.id == lightId);

  state = new LightState().transition(400);

  if (color.hue != null) state.hue(color.hue);
  if (color.sat != null) state.sat(color.sat);
  if (color.bri != null) state.bri(color.bri);


  promises.push(hueBridge.lights.setLightState(light._data.id, state));
} else {

  for (let i = 0; i < lights.length; i++ ) {
    let state;
    let light = lights[i];

    state = new LightState().transition(400);

    if (color.hue != null) state.hue(hue);
    if (color.sat != null) state.sat(sat);
    if (color.bri != null) state.bri(bri);

    promises.push(hueBridge.lights.setLightState(light._data.id, state));
  };
};
let promise = await Promise.all(promises);
updateLights(); //Request new light data
};


module.exports = {
  lights,
  updateLights,
  discoverBridge,
  prepareHue,
  randomiseLights,
  toggleLights,
  changeBrightness,
  setColorValues,
  discoLights,
  rainbowLoop,
  getLightStates,
}
