const { MessageEmbed } = require("discord.js")
module.exports.start = function(client, dirpath) {
    const { getlang } = require(dirpath + '/_lang.js')
    const { getconfig } = require(dirpath + '/_config.js')
    const { log } = require(dirpath + '/modules/log.js')
    
    client.on('messageDelete', msg => {
        getconfig(msg.guild.id, 'LogModifiedMessages', function(isOn) {
            if (isOn != false && isOn != 0) {
                const msge = new MessageEmbed()
                    .setColor(16711680)
                    .setTitle(getlang('message-logger-deleted', msg.guild))
                if (msg.author) {
                    msge.setAuthor(msg.author.username, msg.author.displayAvatarURL())
                    msge.addField(getlang('message-logger-link', msg.guild), msg.url)
                    if (msg.content)
                        msge.addField(getlang('message-logger-contents', msg.guild), msg.content)
                    if (msg.attachments.size) {
                        let strAttach = []
                        msg.attachments.each(att => {
                            if (att.proxyUrl)
                                strAttach.push(att.proxyUrl)
                            else if (att.url)
                                strAttach.push(att.url)
                            else if (att.attachment)
                                strAttach.push(att.attachment)
                            else
                                strAttach.push("UNKNOWN ATTACHMENT")
                        })
                        msge.addField(getlang('message-logger-attachments', msg.guild), strAttach.join("\n"))
                    }
                        
                } else
                    msge.addField(getlang('message-logger-contents-unknown', msg.guild), "...")
                        .setAuthor(getlang('message-logger-author-unknown', msg.guild), client.user.displayAvatarURL())
                log(null, msg.guild, [msge])
            }
        })
    })

    client.on('messageUpdate', (oldmsg, newmsg) => {
        getconfig(newmsg.guild.id, 'LogModifiedMessages', function(isOn) {
            if (isOn != false && isOn != 0) {
                const msge = new MessageEmbed()
                    .setColor(14143239)
                    .setTitle(getlang('message-logger-edited', newmsg.guild))
                if (newmsg.author) {
                    if (!newmsg.content || newmsg.content == oldmsg.content) {
                        return
                    }
                    msge.setAuthor(newmsg.author.username, newmsg.author.displayAvatarURL())
                    msge.addField(getlang('message-logger-link', newmsg.guild), newmsg.url)
                    // Before
                    if (oldmsg && oldmsg.content)
                        msge.addField(getlang('message-logger-before-edit', newmsg.guild), oldmsg.content)
                    else
                        msge.addField(getlang('message-logger-before-edit', newmsg.guild), getlang('message-logger-edit-wasnt-found', newmsg.guild))
                    // After
                    if (newmsg.content)
                        msge.addField(getlang('message-logger-after-edit', newmsg.guild), newmsg.content)
                    if (newmsg.attachments.size) {
                        let strAttach = []
                        newmsg.attachments.each(att => {
                            if (att.proxyUrl)
                                strAttach.push(att.proxyUrl)
                            else if (att.url)
                                strAttach.push(att.url)
                            else if (att.attachment)
                                strAttach.push(att.attachment)
                            else
                                strAttach.push("UNKNOWN ATTACHMENT")
                        })
                        msge.addField(getlang('message-logger-attachments', newmsg.guild), strAttach.join("\n"))
                    }
                        
                } else
                    msge.addField(getlang('message-logger-contents-unknown', newmsg.guild), "...")
                        .setAuthor(getlang('message-logger-author-unknown', newmsg.guild), client.user.displayAvatarURL())
                log(null, newmsg.guild, [msge])
            }
        })
    })
}