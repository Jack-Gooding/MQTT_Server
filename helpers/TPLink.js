const { Client } = require('tplink-smarthome-api');

const tpLinkClient = new Client();

let plugs = [];
tpLinkClient.on('device-new', async (device) => {
  // let deviceInfo = JSON.stringify(device.getSysInfo());
  // let deviceInfo = device.getSysInfo();

  //console.log(device.relayState);

  //device.setPowerState(!device.relayState);
  //device.togglePowerState();

  let exists = false;
  // console.log(deviceInfo);
  console.log(device.client);
  console.log(device.host);
  console.log(device.host);
  console.log(device.alias);
  console.log(device.deviceId);

  plugs.forEach(async (plug) => {
    console.log(`${device.host} - ${plug.host}`);
    if (plug.deviceId === device.deviceId) {
      exists = true;
      console.log(`Duplicate Plug! Host: ${device.host}`);
    }
  });

  if (!exists) {
    plugs.push(device);
    device.on("power-off", function(e) {
      console.log(`${device.name} power off :(`);
    })
  }
});

const toggle = async function (id = 0, state = undefined) {
  if (state != null || state != undefined) {
    plugs[id].setPowerState(state);
  } else {
    if (Array.isArray(id)) {
      id.forEach(function(i) {
        plugs[i].togglePowerState();
      })
    } else {
      plugs[id].togglePowerState();
    };
  }
};

const discoverPlugs = async function() {

  tpLinkClient.startDiscovery({discoveryTimeout: 5000,});

  console.log(`Found ${plugs.length} plugs: ${plugs.map(function(plug) {return `${plug.name}`})}`);
};

// discoverPlugs();

module.exports = {
  plugs,
  toggle,
  discoverPlugs
}
