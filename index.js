//https://discord.com/api/oauth2/authorize?client_id=872846014837584024&permissions=122726720641&scope=bot
const Discord = require('discord.js')
// https://discord.com/developers/docs/topics/gateway
const intents = [
    "GUILDS", 
    "GUILD_MEMBERS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    "GUILD_VOICE_STATES",
    "GUILD_MESSAGES",
]
const client = new Discord.Client({intents: intents, partials: ['MESSAGE'], makeCache: Discord.Options.cacheWithLimits({
    MessageManager: 1, // This is default
    PresenceManager: 0,
    // Add more class names here
})})

const {readfile} = require(__dirname + '/_file.js')
const importer = require(__dirname + '/_importer.js')
require(__dirname + '/_config.js') // Init config

const modules = importer.import(__dirname + '/modules/')
for (let key in modules) {
    if (modules[key].start) {
        modules[key].start(client, __dirname)
    }
}

readfile('token.txt', function(token) {client.login(token)}, console.log)

/*
const http = require('http')

http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"})
    response.end("HELP MEEEEEE!!!!!!!!!!!!\n")
}).listen(process.env.PORT)
*/