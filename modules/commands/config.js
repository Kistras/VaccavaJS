const {MessageEmbed} = require("discord.js")
const { Permissions } = require('discord.js');

let getlang
let config
let log
module.exports.start = function(client, dirpath) {
    getlang = require(dirpath + '/_lang.js').getlang
    config = require(dirpath + '/_config.js')
    log = require(dirpath + '/modules/log.js').log
}

function constructInfo(data, gd) {
    var embed = new MessageEmbed()
    for (key in data) {
        try {
            embed.addField(key, `${data[key]}`, true)
        } catch {
            console.log(key)
        }
    }
    embed.setColor("GOLD")
    embed.setTitle(getlang('config-info-title', gd))
    return embed
}

module.exports.action = function(client, msg, splittext) {
    if (msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        config.getconfig(msg.guild.id, null, function (guildConfig) {
            if (splittext.length == 1)
                msg.channel.send({content: getlang('config-main', msg.guild), embeds: [constructInfo(guildConfig, msg.guild)]})
            else {
                if (splittext.length === 3) {
                    const field = splittext[1]
                    if (!(field in config.defaultConfig)) {
                        msg.channel.send(getlang('config-invalid-field', msg.guild))
                        return
                    }
                    const data = splittext[2]
                    config.editconfig(msg.guild.id, field, data, function(err) {
                        if (err)
                            msg.channel.send(getlang('config-editing-error', msg.guild) + "\n" + err)
                        else
                            msg.channel.send(getlang('config-editing-success', msg.guild))
                            log(getlang('config-editing-result', msg.guild) + ` \`${field}\` => \`${data}\``, msg.guild)
                    })
                }
            }
        })
    } else {
        msg.channel.send(getlang('no-permission', msg.guild))
    }
}
