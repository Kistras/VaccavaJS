//https://discord.com/api/oauth2/authorize?client_id=872846014837584024&permissions=122726720641&scope=bot
const Discord = require('discord.js')
const fs = require('fs')
// https://discord.com/developers/docs/topics/gateway
const intents = [
    "GUILDS", 
    "GUILD_MEMBERS",
    "GUILD_WEBHOOKS",
    "GUILD_INVITES",
    "GUILD_VOICE_STATES",
    "GUILD_MESSAGES",
]
const client = new Discord.Client({intents: intents, partials: ['MESSAGE']})

const {readfile} = require(__dirname + '/_file.js')

readfile('token.txt', function(token) {client.login(token)}, console.log)

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

client.on('ready', async () => {
    const gl       = await client.guilds.resolve('856938119017529394')
    const path = __dirname + '/backups/' + gl.name
    if (!fs.existsSync(path)){fs.mkdirSync(path)}
    var channels = (await gl.channels.fetch()).filter(ch => ch.isText())
    var threads = []
    var a = 0
    await channels.each(async ch => {
        if (ch.isText()) {
            a += 1
            console.log(`(${a}/${channels.size}) Started ${ch.name}`)
            await sleep(1000)
            let logs = []
            const msg = ch.messages
            let lastmessage = 0
            while (true) {
                const messages = await msg.fetch({limit: 50, after: lastmessage})
                if (messages.size == 0) break
                //console.log(messages)
                messages.sort((msgA, msgB) => msgA.createdTimestamp - msgB.createdTimestamp).each(m => {
                    let actionrow = []
                    m.components.forEach(function(item, index, array) {
                        actionrow.push(item.toJSON())
                    })
                    let attachments = []
                    m.attachments.each(i => {
                        attachments.push(i.url)
                    })
                    let embeds = []
                    m.embeds.forEach(function(item, index, array) {
                        embeds.push(item.toJSON())
                    })
                    let msgdata = {
                        "id": m.id,
                        "edit": m.editedTimestamp,
                        "time": m.createdTimestamp,
                        "author": m.author.id,
                        "content": m.content,
                        "components": actionrow,
                        "attachments": attachments,
                    }
                    logs.push(msgdata)
                    //console.log(count, ' - ', m.content)
                    lastmessage = m.id
                })
            }
            const channelinfo = {
                "name": ch.name,
                "id": ch.id,
                "guildid": gl.id,
                "nsfw": ch.nsfw,
                "created": ch.createdTimestamp,
                "messages": logs
            }
            await fs.writeFileSync(path + `/${ch.name}-${ch.id}.json`, JSON.stringify(channelinfo))
            a -= 1
            console.log(`(${a}/${channels.size}) Finished ${ch.name}`)
            //error(1)
        }
    })
    while (a > 0) {await sleep(50)}
    error(1)
})
client.on('message', async (msg) => {
    //console.log(msg)
})

/*
const http = require('http')

http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"})
    response.end("HELP MEEEEEE!!!!!!!!!!!!\n")
}).listen(process.env.PORT)
*/