const {MessageEmbed} = require("discord.js")

let getlang
let config
module.exports.start = function(client, dirpath) {
    getlang = require(dirpath + '/_lang.js').getlang
    config = require(dirpath + '/_config.js')
}

function constructInfo(data, gd) {
    var embed = new MessageEmbed()
    for (key in data) {
        embed.addField(key, data[key], true)
    }
    embed.setColor("GOLD")
    embed.setTitle(getlang('config-info-title', gd))
    return embed
}

module.exports.action = function(client, msg, splittext) {
    config.getconfig(msg.guild.id, null, function (guildConfig) {
        if (splittext.length == 1)
            msg.channel.send(getlang('config-main', msg.guild), embeds = [constructInfo(guildConfig, msg.guild)])
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
                })
            }
        }
    })
}
