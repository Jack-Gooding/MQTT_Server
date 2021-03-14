


//Test Script for creating Websocket connections to React UI
//Updates 'Desk Light', 'Desk Keypad', 'Smart Plugs' components


const WebSocket = require('ws');
const mqtt = require('mqtt'); //MQTT protocols


require('dotenv').config();
const username = process.env.USERN;
const password = process.env.PASS;

let sockets = [];

let plugs = [];
let deskLights = false;


function noop() {}
function heartbeat() {
  console.log("this");
  this.isAlive = true;
}

const wss = new WebSocket.Server({ port: 3233 });

// wss.on('connection', function connection(ws) {
//   ws.isAlive = true;
//   ws.on('pong', heartbeat);
// });

let connectionsCount = 0;

// wss.on('connection', function connection(ws) {
//   ws.on('message', function incoming(message) {
//     console.log('received: %s', message);
//   });
//   count++;
//   ws.send(count);
// });


const interval = setInterval(function ping() {

  let socketsToRemove = [];

  sockets.forEach(function each(socket, index) {
    if (socket.ws.isAlive === false) {
      socketsToRemove.push(socket);
      return socket.ws.terminate()
    };
    socket.ws.isAlive = false;
    socket.ws.ping(noop);
  });

  socketsToRemove.forEach((item, i) => {
    socketIndex = sockets.findIndex((socket) => socket == item);
    sockets.splice(socketIndex, 1);
  });

  console.log("sockets.length: " + sockets.length);
}, 3000);

wss.on('close', function close(ws) {
  clearInterval(interval);

});

wss.on('connection', function connection(ws, req) {
  let socket = {ws: ws};
  socket.ws.isAlive = true;
  const ip = req.socket.remoteAddress;
  console.log(ip);
  console.log("url: ", req.url.split("/")[1]);
  socket.url = req.url.split("/")[1];

  connectionsCount++;

  socket.ws.on('message', function incoming(data) {
    // wss.clients.forEach(function each(c) {
    //   if (c.readyState === WebSocket.OPEN) {
    //     c.send(connectionsCount);
    //   }
    // });

    if (data.url === "/plugs" || JSON.parse(data).url === "/plugs") {
      console.log(JSON.parse(data));
      socket.ws.send(JSON.stringify(['plugs', {topic: "broker/plugs", message: plugs}]));
    }
    if (data.url === "/desk/lights" || JSON.parse(data).url === "/desk/lights") {
      console.log(JSON.parse(data));
      socket.ws.send(JSON.stringify(['desk/lights', {topic: "desk/lights", message: deskLights}]));
    }
  });

  socket.ws.on('pong', heartbeat);

  sockets.push(socket);
});




let attemptConnection = () => {
  try {
    let client = mqtt.connect('mqtts://jack-gooding.com', {
      port: 8883,
      clientId: "Websocket Test Script",
      username: username,
      password: password
    });



client.on('connect', async () => {
  client.subscribe('device/connected');
  client.subscribe('clients/connected');
  client.subscribe('broker/plugs');
  client.subscribe('keypad/button/pressed');
  client.subscribe('keypad/button/released');
  client.subscribe('desk/lights');

  console.log('connecttttttttt');
});

client.on('message', async (topic, msg) => {
  message = msg.toString('utf8');
  console.log(topic, message);

  if (topic.split("/")[0] === 'keypad' && topic.split("/")[1] === "button" ) {

    sockets.forEach((socket) => {
      if (socket.url === "keypad") {
        if (socket.ws.readyState === WebSocket.OPEN) {
          socket.ws.send(JSON.stringify(['keypad', {topic, message}]));
        };
      };
    });

  };

  if (topic === "broker/plugs") {
    console.log("broker/plugs");
    console.log(sockets.length);
    plugs = message;
    sockets.forEach((socket) => {
      if (socket.url === "plugs") {
        if (socket.ws.readyState === WebSocket.OPEN) {
          socket.ws.send(JSON.stringify(['plugs', {topic, message}]));
        };
      };
    });
  };

  if (topic === "desk/lights") {
    console.log("desk/lights");
    console.log(sockets.length);
    deskLights = message;
    sockets.forEach((socket) => {
      if (socket.url === "desk/lights") {
        if (socket.ws.readyState === WebSocket.OPEN) {
          socket.ws.send(JSON.stringify(['desk/lights', {topic, message}]));
        };
      };
    });
  };
});

client.on('error', async (error) => {
  console.log(error);
});

  return client;
  }
  catch(e) {
    console.log(`Failed to connect to MQTT.`)
    console.log(e);
    setTimeout(() => {
      return attemptConnection();
    },3000);
  }
};

let client = attemptConnection();
