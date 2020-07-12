const Discord = require('discord.js');

const discordClient = new Discord.Client();

const { client } = require("./helpers/MQTT");
const hueHelpers = require("./helpers/Philips_Hue");
const blinds = require("./helpers/Blinds");
const tpLinkHelpers = require("./helpers/TPLink");
const custom = require("./helpers/Custom_Devices");

let helpText = `Currently accepted commands:

  !hue-bot [command] [paramater]

  help - display help text
  on - turns all philips hue bulbs on
  off - turns all philips hue bulbs off
  repeat - repeats the paramater
  blinds - sets blinds to a parameter value [0-100]
  fairyOn - turns all fairy string lights on
  fairyOff - turns all fairy string lights off
`;

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

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

    if (words[1] === 'help') {
      msg.reply(helpText);
    } else if (words[1] === 'on') {
      hueHelpers.toggleLights(true);
      msg.reply('bzzt! Turned all philips hue lights on!');
    } else if (words[1] === 'off') {
      hueHelpers.toggleLights(false);
      msg.reply('bzzt! Turned all philips hue lights off!');
    } else if (words[1] === 'repeat') {
      words.splice(0,2);
      msg.reply(`BEEEP - `+words.join(" "));
    } else if (words[1] === 'blinds') {
      if (parseInt(words[2])) {
        blinds.setPosition(parseInt(words[2]));
        msg.reply(`⚡ Moving blinds to position: ${words[2]}% ⚡`);
      } else {
        blinds.setPosition(100,up);
        msg.reply(`⚡ Incomplete command! Moving blinds to position: 100% ⚡`);
      }
    } else if (words[1] === 'fairyOff') {
      tpLinkHelpers.toggle(0,false);
      tpLinkHelpers.toggle(1,false);
      custom.setScreenLights("0");
      custom.setRPiLights("0");
    } else if (words[1] === 'fairyOn') {
      tpLinkHelpers.toggle(0,true);
      tpLinkHelpers.toggle(1,true);
      custom.setScreenLights("255");
      custom.setRPiLights("255");
    }


  }

}
});

discordClient.login('NzMxODk2NTc1OTk5MjEzNjI5.XwsuvA.BE8PDDlDs5F9Hx2JpHiURgX06jA');


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
