//https://discord.com/api/oauth2/authorize?client_id=872846014837584024&permissions=122726720641&scope=bot
const { Client, IntentsBitField } = require('discord.js')
const fs = require('fs')
const sqlite3 = require('sqlite3')
// https://discord.com/developers/docs/topics/gateway
const IBF = new IntentsBitField()
IBF.add(IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildWebhooks, IntentsBitField.Flags.GuildInvites, IntentsBitField.Flags.GuildMessages)

const client = new Client({intents: IBF, partials: ['MESSAGE']})

const {token} = require('./config.json')
client.login(token)

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

client.on('ready', async () => {
    console.log(client.user.username)
    console.log('Fetching guild')
    const gl       = await client.guilds.resolve('845287136264454184')
    //client.user.setPresence({ activities: [{ name: `Saving ${gl.name}` }], status: 'idle' })
    client.user.setPresence({ activities: [{ name: `eGtzWjU4akhid0E=` }], status: 'idle' })
    const glpath = __dirname + '/backups/' + gl.name
    if (!fs.existsSync(glpath)){fs.mkdirSync(glpath)}

    const path = __dirname + '/backups/' + gl.name + '/channels'
    if (!fs.existsSync(path)){fs.mkdirSync(path)}
    
    // DB MOMENT ---------------------------------------------------------
    const db = new sqlite3.Database(`${path}/messages.db`)
    db.run("drop table if exists messages") // Deletes itself if already exists
    //db.configure('busyTimeout',0)

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
    var allchannels = (await gl.channels.fetch()).filter(ch => ch.isTextBased())
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
        if (!v.isVoiceBased()) {
            v.threads.fetchActive().then(doshit)
            v.threads.fetchArchived().then(doshit)
        }
        b = Date.now()
    })
    while (Date.now() - b < 10000) {await sleep(50)} //Just wait
    //await sleep(10000)
    var a = 0
    console.log('Processing...')
    let everything = {}
    db.serialize(() => {
        db.run(`CREATE TABLE messages (
            id INT NOT NULL,
            channelId INT,
            editedTimestamp INT,
            createdTimestamp INT NOT NULL,
            type TEXT,
            embeds TEXT,
            authorId INT,
            content TEXT,
            attachments TEXT,
            reactions TEXT,
            PRIMARY KEY (id)
        );`)

        let bunchsize = 5000
        let queue = []
        async function save(list, forced) {
            if (list) {
                queue.push(list)
            }
            if (forced || queue.length > bunchsize) {
                db.run("begin transaction")
                /*
                let stmt = db.prepare("INSERT or IGNORE INTO messages VALUES (?,?,?,?,?,?,?,?,?,?)");
                for (var l of queue) stmt.run(...l)
                stmt.finalize()
                */
                for (var l of queue) db.run('INSERT or IGNORE INTO messages VALUES (?,?,?,?,?,?,?,?,?,?)', ...l)
                db.run("commit transaction")
                queue = []
            }
            // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
            /*
            if (currentbunch > bunchsize || !stmt || force) {
                if (stmt) {
                    stmt.finalize()
                }
                if (transactionactive) {
                    //db.run("commit")
                    transactionactive = false
                    db.run("commit transaction;")
                }
                if (!force) {
                    if (!transactionactive) {
                        db.run("begin transaction;")
                        transactionactive = true
                    }
                    stmt = db.prepare("INSERT or IGNORE INTO messages VALUES (?,?,?,?,?,?,?,?,?,?)");
                }
                currentbunch = 0
            }
            if (list) {
                stmt.run(...list)
                currentbunch += 1
            }
            */
        }

        for (c in channels) {
            (async () => {
                //console.log(c)
                const ch = channels[c]
                if (ch.isTextBased()) {
                    var permissions = {}
                    if (ch.permissionOverwrites) ch.permissionOverwrites.cache.each(function(v,k) {
                        permissions[v.id] = {
                            "id": v.id,
                            "type": v.role,
                            "deny": "" + v.deny.bitfield,
                            "allow:": "" + v.allow.bitfield,
                        }
                    })
                    everything[ch.id] = {
                        "name": ch.name,
                        "id": ch.id,
                        "guildid": gl.id,
                        "nsfw": ch.nsfw,
                        "created": ch.createdTimestamp,
                        "permissions": permissions,
                        'messages': 0,
                        "threadparent": (ch.isThread() ? ch.parentId : null),
                        'lastmsg': 0,
                        'lasttime': 0
                    }
                    a += 1
                    let nmsg = ch.messages
                    console.log(`(${a}/${channels.length}) Started ${ch.name}`)
                    await (async (msg)=>{
                        while (true) {
                            const ch = msg.channel
                            let messages
                            if (!everything[msg.channel.id]['lastmsg'])
                                messages = await msg.fetch({limit: 50})
                            else
                                messages = await msg.fetch({limit: 50, before: everything[msg.channel.id]['lastmsg']})
                            console.log(ch.name, everything[ch.id]['messages'])
                            if (ch.name == 'countdown') console.log(everything[ch.id]['lastmsg'])
                            if (messages.size == 0) break
                            //console.log(messages)
                            //await sleep(10)
                            //console.log(messages.size, msg.channel.id,)
                            for (m of messages.sort((msgA, msgB) => msgB.createdTimestamp - msgA.createdTimestamp).values()) {
                                const chid = m.channelId
                                /*
                                let actionrow = []
                                m.components.forEach(function(item, index, array) {
                                    actionrow.push(item.toJSON())
                                })
                                */
                                let attachments = []
                                m.attachments.each(i => {
                                    attachments.push(i.url)
                                })
                                
                                let embeds = []
                                m.embeds.forEach(function(item, index, array) {
                                    embeds.push(item.toJSON())
                                })
                                
                                let reactions = []
                                if (m.reactions.cache.first()) {
                                    for (i in m.reactions.cache) {
                                        let reacted = []
                                        let us = await i.users.fetch()
                                        us.each(u => {
                                            reacted.push(`${u.id}`)
                                        })
                                        reactions.push({
                                            "emoji": i.emoji.toString(),
                                            "count": i.count,
                                            "users": reacted
                                        })
                                        await sleep(10)
                                    }
                                }

                                /*
                                let msgdata = {
                                    "id": m.id,
                                    "channelid": m.channelId,
                                    "edit": m.editedTimestamp,
                                    "time": m.createdTimestamp,
                                    "type": m.type,
                                    "embeds": embeds,
                                    "author": m.author.id,
                                    "content": m.content,
                                    "components": actionrow,
                                    "attachments": attachments,
                                    "reactions": reactions
                                }
                                */
                                //db.run(`INSERT or IGNORE INTO messages VALUES (?,?,?,?,?,?,?,?,?,?);`,m.id,m.channelId,m.editedTimestamp,m.createdTimestamp,m.type,JSON.stringify(m.embeds),m.author.id,m.content,JSON.stringify(attachments),JSON.stringify(reactions))
                                await save([m.id,m.channelId,m.editedTimestamp,m.createdTimestamp,m.type,JSON.stringify(m.embeds),m.author.id,m.content,JSON.stringify(attachments),JSON.stringify(reactions)], false)
                                everything[chid]['messages'] += 1
                                if (!everything[chid]['lastmsg'] || m.createdTimestamp < everything[chid]['lasttime']) {
                                    everything[chid]['lastmsg'] = m.id
                                    everything[chid]['lasttime'] = m.createdTimestamp
                                }
                                await sleep(10)
                            }
                            if (messages.size < 50) break
                        }
                    })(nmsg)
                    a -= 1
                    console.log(`(${a}/${channels.length}) Finished ${ch.name} (${everything[ch.id]['messages']})`)
                    if (a == 0) {
                        console.log('AAAAAAAAAAAAAAAAAAAAAAAAA')
                        await save(null, true)
                        for (ch11 in everything) {
                            if (everything.hasOwnProperty(ch11)) {
                                const ch1 = everything[ch11]
                                await fs.writeFileSync(path + `/${ch1.name.replaceAll('|', '').replaceAll('\\', '').replaceAll('//', '').replaceAll('*', '').replaceAll('?', '').replaceAll('<', '').replaceAll('>', '').replaceAll(':', '')}-${ch1.id}.json`, JSON.stringify(ch1, null, 1), {encoding: "utf8"})
                            }
                        }
                        //db.close();
                    }
                }
            })()
        }
    })
    await sleep(1000)
    while (a > 0) await sleep(50) // just wait
    client.destroy()
})
