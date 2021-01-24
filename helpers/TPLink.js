const { Client } = require('tplink-smarthome-api');
const {client} = require('./MQTT');

const tpLinkClient = new Client();

let plugs = [];
tpLinkClient.on('device-new', async (device) => {
  // let deviceInfo = JSON.stringify(device.getSysInfo());
  // let deviceInfo = device.getSysInfo();

  //Assume plug is new, check for duplicates
  let exists = false;

  plugs.forEach(async (plug) => {
    // console.log(`${device.host} - ${plug.host}`);
    if (plug.deviceId === device.deviceId) {
      exists = true;
      console.log(`Duplicate Plug! Host: ${device.host}`);
    }
  });
  // console.log(deviceInfo);
  // console.log(device.relayState);
  // console.log(device.client);
  // console.log(device.host);
  // console.log(device.host);
  // console.log(device.alias);
  // console.log(device.deviceId);

  if (!exists) {
    plugs.push(device);
    console.log(`Found new smart plug!: ${device.alias}`);
    device.on("power-on", function(e) {
      console.log(`${device.name} power on :)`);

    })
    device.on("power-off", function(e) {
      console.log(`${device.name} power off :(`);

    })
  }

  let payload = [];
	plugs.forEach((plug) => {
  	payload.push({
  		name: plug.alias,
  		id: plug.deviceId,
  		on: device.relayState,
  	});
  });
  client.publish("broker/plugs", JSON.stringify(payload));
});

const toggle = async function (id = 0, state = undefined) {

  if (state != null || state != undefined) {
    if (typeof id === 'number') {
      let plug;

      //Interface submits the actual ID
      //server request only submits integer as index
      if (typeof id === 'number') {
         if (id > plugs.length-1 || id < 0) {
           id = 0;
         }
         plug = plugs[id];
       } else {
         plug = plugs.find((plug) => plug.id == id);
       }


    plug.setPowerState(state);
  } else if (Array.isArray(id)) {
      id.forEach(function(i) {
        plugs[i].togglePowerState();
      })
  } else {
      plugs[id].togglePowerState();
  };
};
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
};
