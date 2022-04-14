const hueHelpers = require("../helpers/Philips_Hue");
const v3 = require("node-hue-api").v3;
const axios = require("axios");
const LightState = v3.lightStates.LightState;
let discovery = v3.discovery;
let hueApi = v3.api;
let hueBridgeLocation;
let hueBridge;
let lights = [];

const appName = "node-hue-api";
const deviceName = "node-hue-api";

async function discoverAndCreateUser() {
  const ipAddress = await hueHelpers.discoverBridge();

  // Create an unauthenticated instance of the Hue API so that we can create a new user
  const unauthenticatedApi = await hueApi.createLocal(ipAddress).connect();

  let createdUser;
  try {
    createdUser = await unauthenticatedApi.users.createUser(
      appName,
      deviceName
    );
    console.log(
      "*******************************************************************************\n"
    );
    console.log(
      "User has been created on the Hue Bridge. The following username can be used to\n" +
        "authenticate with the Bridge and provide full local access to the Hue Bridge.\n" +
        "YOU SHOULD TREAT THIS LIKE A PASSWORD\n"
    );
    console.log(`Hue Bridge User: ${createdUser.username}`);
    console.log(`Hue Bridge User Client Key: ${createdUser.clientkey}`);
    console.log(
      "*******************************************************************************\n"
    );

    // Create a new API instance that is authenticated with the new user we created
    const authenticatedApi = await hueApi
      .createLocal(ipAddress)
      .connect(createdUser.username);

    // Do something with the authenticated user/api
    const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
    console.log(
      `Connected to Hue Bridge: ${bridgeConfig.name} :: ${bridgeConfig.ipaddress}`
    );
  } catch (err) {
    if (err.getHueErrorType() === 101) {
      console.error(
        "The Link button on the bridge was not pressed. Please press the Link button and try again."
      );
    } else {
      console.error(`Unexpected Error: ${err.message}`);
    }
  }
}

// Invoke the discovery and create user code
// discoverAndCreateUser();

const runTest = async () => {
  let lights = await hueHelpers.prepareHue();

  lights.forEach(async (light) => {
    console.log("light");
    console.log(`${light._data.name}: ${light._data.id}`);
    await hueHelpers.randomiseLights(light._data.id);
  });

  return;
};

runTest();
