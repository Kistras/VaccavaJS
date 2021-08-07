const { MessageEmbed } = require("discord.js")

let getlang
module.exports.start = function(client, dirpath) {
    getlang = require(dirpath + '/_lang.js').getlang
}

module.exports.action = function(client, msg, splittext) {
    let num
    var text = getlang('roll-result', msg.guild)
    switch (splittext.length) {
        case 1:
            num = 1 + Math.random() * 5
            text += "1" + getlang('and', msg.guild) + "6"
        break
        case 2:
            num = 1 + Math.random() * parseInt(splittext[1] - 1)
            text += "1" + getlang('and', msg.guild) + splittext[1]
        break
        case 3:
            num = parseInt(splittext[1]) + Math.random() * (parseInt(splittext[2]) - parseInt(splittext[1]))
            text += splittext[1] + getlang('and', msg.guild) + splittext[2]
        break
        default:
            msg.channel.send('ARGUMENT NUMBER ERROR')
            return
        break
    }
    
    const roll = new MessageEmbed()
        .setColor(65407)
        .addField(text, Math.round(num))
    msg.channel.send(embeds = [roll])
}
