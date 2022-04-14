const { Client } = require('tplink-smarthome-api');
const {client} = require('./MQTT');

const tpLinkClient = new Client();

let plugs = [];
let plugsData = [];

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


  if (!exists) {
    plugs.push(device);
    plugsData.push({name: device.name, id: device.deviceId, on: device.relayState});


    console.log(`Found new smart plug!: ${device.alias}`);
    device.on("power-on", function(e) {
      console.log(`${device.name} power on :)`);

    })
    device.on("power-off", function(e) {
      console.log(`${device.name} power off :(`);

    })
  } else {
    // cause an error until updates
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
      let plugDataPlug;

      //Interface submits the actual ID
      //server request only submits integer as index
      if (typeof id === 'number') {
         if (id > plugs.length-1 || id < 0) {
           id = 0;
         }
         plug = plugs[id];
         // plugDataPlug = plugsData.find((plug) => plug.id == id);
         plugDataPlug = plugsData[id];


         //Detail why this happens
       } else {
         plug = plugs.find((plug) => plug.id == id);
         plugDataPlug = plugsData.find((plug) => plug.id == id);

       };

    console.log(`${plugDataPlug.name}: ${plugDataPlug.on}`);
    plug.setPowerState(state);
    plugDataPlug.on = state;
    console.log(`${plugDataPlug.name}: ${plugDataPlug.on}`);

    // console.log(`${plugs[id].name}: ${plugDataPlug[id].relayState}`);

  } else if (Array.isArray(id)) {
      id.forEach(function(i) {
        console.log(`${plugsData[id].name}: ${plugsData[id].on}`);
        plugs[i].togglePowerState();
        plugsData[id].on = state;
        console.log(`${plugsData[id].name}: ${plugsData[id].on}`);

      })
  } else {

    plug = plugs.find((plug) => plug.id == id);
    plug.togglePowerState();
    plugDataPlug = plugsData.find((plug) => plug.id == id);
    plugDataPlug.on = state;

  };
  client.publish("broker/plugs", JSON.stringify(plugsData));
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
