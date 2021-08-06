//https://discord.com/api/oauth2/authorize?client_id=872846014837584024&permissions=122726720641&scope=bot
const Discord = require('discord.js')
const client = new Discord.Client()

const {readfile} = require('./_file.js')
const importer = require('./_importer.js')
require('./_config.js') // Init config

const modules = importer.import('./modules/')
for (let key in modules) {
    if (modules[key].start) {
        modules[key].start(client, __dirname)
    }
}

readfile('token.txt', function(token) {client.login(token)}, console.log)
