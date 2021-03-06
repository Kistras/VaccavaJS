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
    console.log('Fetching guild')
    const gl       = await client.guilds.resolve('845287136264454184')
    client.user.setPresence({ activities: [{ name: `Saving ${gl.name}` }], status: 'idle' })
    const glpath = __dirname + '/backups/' + gl.name
    if (!fs.existsSync(glpath)){fs.mkdirSync(glpath)}

    const path = __dirname + '/backups/' + gl.name + '/channels'
    if (!fs.existsSync(path)){fs.mkdirSync(path)}

    console.log('Fetching roles')
    var roles = []
    const ros = await gl.roles.fetch()
    ros.each(function(v,k) {
        roles.push({
            "color": v.hexColor,
            "name": v.name,
            "position": v.position,
            "id": v.id,
            "createdTimestamp": v.createdTimestamp,
            "botowner": v.botId,
            "mentionable": v.mentionable,
            "managed": v.managed,
            "hoist": v.hoist,
            "permissions": v.permissions.bitfield + "",
        })
    })
    await fs.writeFileSync(glpath + `/roles.json`, JSON.stringify(roles, null, 1), {encoding: "utf8"})

    console.log('Fetching channels')
    var allchannels = (await gl.channels.fetch()).filter(ch => ch.isText())
    var threads = []
    var channels = []
    var b = Date.now()

    function doshit(th) {
        const thr = th.threads
        if (thr.size > 0) {
            thr.each(v1 => {
                channels.push(v1)
                console.log(`Got ${v1.name}`)
            })
        }
        b = Date.now()
    }

    await allchannels.each(v => {
        //console.log(v)
        channels.push(v)
        v.threads.fetchActive().then(doshit)
        v.threads.fetchArchived().then(doshit)
        b = Date.now()
    })
    while (Date.now() - b < 10000) {await sleep(50)} //Just wait
    //await sleep(10000)
    var a = 0
    console.log('Processing...')
    for (c in channels) {
        (async () => {
            console.log(c)
            const ch = channels[c]
            if (ch.isText()) {
                a += 1
                const msg = ch.messages
                console.log(`(${a}/${channels.length}) Started ${ch.name}`)
                let logs = []
                await (async ()=>{
                    let lastmessage = 0
                    let count = 0
                    while (true) {
                        const messages = await msg.fetch({limit: 50, after: lastmessage})
                        if (messages.size == 0) break
                        //console.log(messages)
                        messages.sort((msgA, msgB) => msgA.createdTimestamp - msgB.createdTimestamp).each(m => {
                            count += 1
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
                                "type": m.type,
                                "embeds": embeds,
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
                })()
                var permissions = {}
                if (ch.permissionOverwrites) ch.permissionOverwrites.cache.each(function(v,k) {
                    permissions[v.id] = {
                        "id": v.id,
                        "type": v.role,
                        "deny": "" + v.deny.bitfield,
                        "allow:": "" + v.allow.bitfield,
                    }
                })
                const channelinfo = {
                    "name": ch.name,
                    "id": ch.id,
                    "guildid": gl.id,
                    "nsfw": ch.nsfw,
                    "created": ch.createdTimestamp,
                    "messages": logs,
                    "permissions": permissions
                }
                await fs.writeFileSync(path + `/${ch.name}-${ch.id}.json`, JSON.stringify(channelinfo, null, 1), {encoding: "utf8"})
                a -= 1
                console.log(`(${a}/${channels.length}) Finished ${ch.name}`)
            }
        })()
    }
    await sleep(1000)
    while (a > 0) await sleep(50) // just wait
    error(1)
})
