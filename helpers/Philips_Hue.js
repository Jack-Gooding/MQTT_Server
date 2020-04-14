const v3 = require('node-hue-api').v3;
const LightState = v3.lightStates.LightState;
let discovery = v3.discovery;
let hueApi = v3.api;
let hueBridgeLocation;
let hueBridge;
let lights = [];

const username = "8FNEwdPyoc9eVRxP7ukCnf4QFowMK2aoHOmBuJdi";

async function discoverBridge() {
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


prepareHue = async () => {
  hueBridgeLocation = await discoverBridge();
  hueBridge =  await hueApi.createLocal(hueBridgeLocation).connect(username);
  lights = await hueBridge.lights.getAll();
  console.log(`Found ${lights.length} Lights!`);
  return lights;
}



async function randomiseLights() {
  console.log("randomiseLights");
  //console.log(hueApi);
  if (lights) {
    //console.log(hueApi);

    //console.log(lights);
    let promises = [];
    for (let i = 0; i < lights.length; i++ ) {
      let light = lights[i];
      let state;

      if (light._data.type === "Extended color light") {
        state = new LightState().transition(0).hue(Math.random()*65535).sat(Math.random(254/2)+(254/2)).on();
      } else {
        state = new LightState().transition(0).on();
      }
      promises.push(hueBridge.lights.setLightState(light._data.id, state));
    };
    let promise = await Promise.all(promises);
    console.log(promise);
    //console.log(hueApi.lights.getAll());
  } else {
    await prepareHue();
    randomiseLights();
  };
};


async function toggleLights(intended) {
  //console.log(hueApi);
  if (lights) {
  //console.log(hueApi);

  //console.log(lights);
  let promises = [];
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
  let promise = await Promise.all(promises);
  //console.log(hueApi.lights.getAll());
} else {
  await prepareHue();
  turnLightsOff();
};
};


async function changeLightBrightness(direction, interval) {
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
        console.log("0 reached, idiot");
      }
    }
    promises.push(hueBridge.lights.setLightState(light._data.id, state));
  };
  let promise = await Promise.all(promises);
};

  //changes brightness by {amount}, -254 -> 254
async function changeBrightness(amount) {

  let promises = [];
  for (let i = 0; i < lights.length; i++ ) {
    let light = lights[i];
    let state;

    state = new LightState().transition(200).bri_inc(amount);

    promises.push(hueBridge.lights.setLightState(light._data.id, state));
  };
  let promise = await Promise.all(promises);
};


module.exports = {
  lights,
  discoverBridge,
  prepareHue,
  randomiseLights,
  toggleLights,
  changeBrightness,
}
