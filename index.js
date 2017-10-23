const Discord = require('discord.js');
const hook = require('ll-keyboard-hook-win');
const keyBindings = require('./keyBindings');

const TOKEN = require('./token');
const MY_USERNAME = 'Namse';

const client = new Discord.Client();
const broadcast = client.createVoiceBroadcast();

function findGuildMemeber(username) {
  let ret;
  client.channels.array().forEach(({type, members}) => {
    if (type !== 'voice') {
      return;
    }
    const guildMember = members.array().find(guildMember =>
      guildMember.user.username === username);

    if (guildMember) {
      ret = guildMember;
    }
  });
  return ret;
}

client.on('ready', () => {
  console.log('I am ready!');

  const { voiceChannel } = findGuildMemeber(MY_USERNAME);

  if (!voiceChannel) {
    console.log("Cannot find your channel. Please check 1. you're logging in, 2. joining in voice channel.");
    return;
  }
  voiceChannel.join()
    .then(() => console.log("I joined channel!"))
    .catch(console.log);
});

client.login(TOKEN);

Object.entries(keyBindings).forEach(([key, songName]) => {
  hook.on('down', key, (event) => {
    console.log(event);
    const dispatcher = broadcast.playFile(`./sounds/${songName}`);

    // dispatcher.setVolume(1); // Set the volume to 50%

    // Play "music.mp3" in all voice connections that the client is in
    for (const connection of client.voiceConnections.values()) {
      connection.playBroadcast(broadcast);
    }
  });
});
