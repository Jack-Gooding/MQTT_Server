const dotenv = require('dotenv').config();

const Discord = require('discord.js');
const axios = require('axios');

const discordClient = new Discord.Client();

const mqtt = require('mqtt'); //MQTT protocols

const client  = mqtt.connect('mqtt://jack-gooding.com', {
    port: 1883,
    clientId: "Discord bot",
});

client.on('connect', () => {
  client.subscribe('device/connected');
  client.subscribe('clients/connected');
});

const hueHelpers = require("./helpers/Philips_Hue");
const blinds = require("./helpers/Blinds");
const tpLinkHelpers = require("./helpers/TPLink");
const custom = require("./helpers/Custom_Devices");

const fs = require("fs");
const canvas = require("./helpers/canvas");


let helpText = `Currently accepted commands:

  !hue-bot [command] [paramater]

  help - display help text
  Phillips Hue:

    on - turns all philips hue bulbs on.
    off - turns all philips hue bulbs off.
    randomiseLights - turns all phillips hue bulbs to a random colour.
    rainbowLoop - loops through all colours with a [paramater] second cycle.
    discoLights - changes every each phillips hue bulb to a random colour every [paramater] seconds, with a [paramater] second transition time.
    statusCheck - checks the status of all bulbs.

  repeat - repeats the paramater.

  blinds - sets blinds to a parameter value [0-100].

  fairyOn - turns all fairy string lights on.
  fairyOff - turns all fairy string lights off.

  ⚡ Danger - I should really limit who can summon this ⚡

    roomCheck - Requests a photo of my room in potato cam
    homeCheck - Find out if I'm at home.

  ⚡ Danger ⚡

  isDead? - checks if hue is dead.
`;

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

async function getPhoto() {
  try {
    const response = await axios({
      url: 'http://192.168.1.107:3135/api/cam/capture',
      method: 'GET',
      responseType: 'stream',
    });
    //console.log(response.data);
    return response;
  } catch (error) {
    console.error(error);
    return false;
  }
};


let checkAuthor = (msg) => {
  if (msg.author.id === "320547898129514498") {
    console.log("Hey Jack!");
    return true;
  } else {
    console.log("Intruder!");
    return false;
  };
};

let checkDirect = (msg) => {
  if (msg.channel.type === 'dm' || !msg.channel.guild) {
    console.log("Direct Message!");
    return true;
  } else {
    console.log("Public Message!");
    return false;
  };
}

discordClient.on("guildMemberAdd", async (member)  => {

  let channel = member.guild.channels.cache.find(channel => channel.name === "general");

  if (member.user.bot) {
    //This needs some form of error checking.
    //`Oops, don't have permissions to do that!`
    let role = member.guild.roles.cache.find(role => role.name === "Scary Robot");
    member.roles.set([role.id]);
    channel.send(`${member.user.username} has joined. They are a robot and have been quarrantined for now. 🤖`);

  } else {

    let role = member.guild.roles.cache.find(role => role.name === "Member");
    member.roles.set([role.id]);
    channel.send(`New member detected! scanning ${member.user.username}.....`);

    setTimeout(async () => {
      channel.send(`...Confirmed. ${member.user.username} is not a bot.`);
    },2000);
  }

});


discordClient.on('message', async (msg) => {
  console.log(msg);
  console.log(msg.author.id);


  let message = "";
  if (msg.content === 'ping') {
    msg.reply('pong');
  };

  if (!msg.author.bot) {

  //creepy repeating
  /*msg.channel.send(`
  Sender: ${msg.author.username}
  Bot Status: ${msg.author.bot}
  Message: ${msg.content}
  `)*/

  let words = msg.content.split(" ");

  if (words[0] === "!hue-bot") {

    if (!checkAuthor(msg) || checkDirect(msg)) {
      discordClient.users.fetch(process.env.DISCORD_USER).then(user => {
        user.send(`Someone summoned me${checkDirect(msg) ? ' privately' : ''}!
          Command: ${msg.content}
          User: ${msg.author.username}
        `);
      })
    };

    if (words[1] === 'help') {
      msg.reply(helpText);
    } else if (words[1] === 'on') {
      hueHelpers.toggleLights(true);
      msg.reply('bzzt! Turned all philips hue lights on!');
    } else if (words[1] === 'off') {
      hueHelpers.toggleLights(false);
      msg.reply('bzzt! Turned all philips hue lights off!');
    } else if (words[1] === 'randomiseLights') {
      let changes = await hueHelpers.randomiseLights();
      console.log(`changes`);
      console.log(changes);

      let cArr = [];

      let response = '🌈 Hue lights are now all cute: 🌈';
      changes.forEach(function(change, index) {
        response += `\n ${change.name} is now set to: hsl(${change.color.hue},${change.color.sat}%,${change.color.lightness}%)`;
        if (index+1 < changes.length) {
          response += `, `;
        }
        cArr.push({name: change.name, color: change.color});
      });

      let attachment = new Discord.MessageAttachment(canvas.randomColourBanner(cArr));
      msg.reply(response, attachment);

    } else if (words[1] === 'rainbowLoop') {

      let transitionDuration = words[2];
      let x = await hueHelpers.rainbowLoop(transitionDuration);

      if (x) {
        msg.reply('🌈🌈🌈🌈🌈🌈🤖🌈🌈🌈🌈🌈🌈');
      } else {
        msg.reply('Rainbow mode is over, sorry.');
      }
    } else if (words[1].toLowerCase() === 'discolights') {

      let transitionDuration = words[2]
      let x = await hueHelpers.discoLights(transitionDuration);

      if (x) {
        msg.reply('🎉 Oh yes. Let\'s go. Let\'s get this party started. 🎉');
      } else {
        msg.reply('Party mode is over. Please remember to clean up after.');
      }
    } else if (words[1].toLowerCase() === 'statuscheck') {
        let cArr = await hueHelpers.getLightStates();
        console.log(cArr);
        let attachment = new Discord.MessageAttachment(canvas.bulbStatesBanner(cArr));

        let response = `🔎 Checking Current Bulb States 🔍`;

        cArr.forEach((cObj) => {
          response += `\n ${cObj.name} is ${cObj.on ? "on" : "off"}. `;
          if (cObj.type === "Extended color light") {
            let hue = Math.round((cObj.color.hue/65535)*360);
            response += `Current colour is hsb(${hue},${cObj.color.sat},${cObj.color.bri})`;
          };
        });

        msg.reply(response, attachment);

    } else if (words[1].toLowerCase() === 'roomcheck') {
      // let photoData = await getPhoto();
      // if (photoData) {
      //   const path = Path.resolve(__dirname, '', 'code.png')
      //   const writer = Fs.createWriteStream(path)
      //   //console.log(photoData.data);
      //
      //   response.data.pipe(writer);
      // };


      // let attachment = new Discord.MessageAttachment(photoData);
      //let attachment = new Discord.MessageAttachment(canvas.reconstructPhoto(photoData, 640, 480));

      if (!checkDirect(msg) || checkAuthor(msg)) {
        msg.reply(`Generating photo.... ⚡......`);

        setTimeout(() => {
          try {
            let attachment = new Discord.MessageAttachment('http://192.168.1.107:3135/api/cam/capture', 'capture.png');
            msg.reply(`Here's a photo.`, attachment);
          } catch (e) {
            msg.reply(`Unable to generate photo. Something bork.`);
            msg.reply(e);
          };
        },(checkAuthor(msg) ? 5000 : 30000));
      } else {
        msg.reply(`🛑 NO PRIVATE ACCESS 🛑`);
        msg.reply(`You can request this in public. Feel free to haunt me in other ways though!`);
      };
    } else if (words[1] === 'repeat') {
      words.splice(0,2);
      msg.reply(`BEEEP - `+words.join(" "));
    } else if (words[1] === 'blinds') {
      if (parseInt(words[2])) {
        let package = blinds.setPosition(parseInt(words[2]));
        client.publish("bedroom/blinds", package);
        msg.reply(`⚡ Moving blinds to position: ${words[2]}% ⚡`);
      } else {
        // let package = blinds.setPosition(100,"up");
        client.publish("bedroom/blinds", "0");
        msg.reply(`⚡ Incomplete command! Moving blinds to position: 100% ⚡`);
      }
    } else if (words[1] === 'fairyOff') {
      tpLinkHelpers.toggle(0,false);
      tpLinkHelpers.toggle(1,false);

      let state = custom.setScreenLights("0");
      client.publish('desk/lights', state);
      state = custom.setRPiLights("0");
      client.publish('rpi/ledString', state);

    } else if (words[1] === 'fairyOn') {
      tpLinkHelpers.toggle(0,true);
      tpLinkHelpers.toggle(1,true);

      let state = custom.setScreenLights("255");
      client.publish('desk/lights', state);

      state = custom.setRPiLights("255");
      client.publish('rpi/ledString', state);

    } else if (words[1] === 'isDead?') {
      msg.reply(`👻 Checking self... Status: Not Dead. 👻`);
    }


  }

}
});

discordClient.login(process.env.DISCORD_KEY);

setInterval(async function() {
  tpLinkHelpers.discoverPlugs();
  hueHelpers.prepareHue();
},30000);
tpLinkHelpers.discoverPlugs();
hueHelpers.prepareHue();

client.on('message', async (topic, msg) => {
  message = msg.toString('utf8');

  if (topic === 'device/connected') {
    //client.publish('device/on', deviceState);
    //console.log('updating device/on with %s', deviceState);
    connected = (message.toString() === 'true');
  } else if (topic === 'clients/connected') {
    console.log(message);
  }
});
