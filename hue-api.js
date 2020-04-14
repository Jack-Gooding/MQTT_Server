const v3 = require('node-hue-api').v3
const LightState = v3.lightStates.LightState;
let discovery = v3.discovery;
let hueApi = v3.api;

let moment = require('moment');

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


async function discoverLights() {
  let host = await discoverBridge();
  //console.log(hueApi);
  hueApi =  await hueApi.createLocal(host).connect(username);
  //console.log(hueApi);
  let lights = await hueApi.lights.getAll();

  let datetime1 = moment();
  let datetimes = [];
  //console.log(lights);
  let promises = [];
  for (let i = 0; i < lights.length; i++ ) {
    let light = lights[i];
    let state;

    if (light._data.type === "Extended color light") {
      state = new LightState().transition(0).hsb(Math.random()*360,100,100).on();
    } else {
      state = new LightState().transition(0).brightness(100).on();
    }
    promises.push(hueApi.lights.setLightState(light._data.id, state));
    datetimes.push(moment().toString());
  };
  let promise = await Promise.all(promises);
  console.log(promise);
  console.log(datetimes);
  //console.log(hueApi.lights.getAll());
};
