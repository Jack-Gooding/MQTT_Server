const { Client } = require('tplink-smarthome-api');

const tpLinkClient = new Client();

let plugs = [];

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

  let x = await tpLinkClient.startDiscovery().on('device-new', (device) => {
    let deviceInfo = JSON.stringify(device.getSysInfo());

    //console.log(device.relayState);

    //device.setPowerState(!device.relayState);
    //device.togglePowerState();

    let exists = false;

    plugs.forEach(function(plug) {
      if (plug === device) {
        exists = true;
      }
    });

    if (!exists) {
      plugs.push(device);
      device.on("power-off", function(e) {
        console.log(`${device.name} power off :(`);
      })
    }
  });

console.log(`Found ${plugs.length} plugs: ${plugs.map(function(plug) {return `${plug.name}`})}`);
};


module.exports = {
  plugs,
  toggle,
  discoverPlugs
}
