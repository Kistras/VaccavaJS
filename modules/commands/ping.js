let getlang
module.exports.start = function(client, dirpath) {
    getlang = require(dirpath + '/_lang.js').getlang
}

module.exports.action = function(client, msg, splittext) {
    msg.channel.send(getlang('ping', msg.guild))
}
