//https://discord.com/api/oauth2/authorize?client_id=872846014837584024&permissions=122726720641&scope=bot
const Discord = require('discord.js')
const client = new Discord.Client()

const {readfile} = require('./_file.js')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.channel.send('I love bacon')
  }
});

readfile('token.txt', function(token) {client.login(token)}, console.log)