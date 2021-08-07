let getlang
module.exports.start = function(client, dirpath) {
    getlang = require(dirpath + '/_lang.js').getlang
}

module.exports.action = function(client, msg, splittext) {
    msg.channel.send("https://www.youtube.com/watch?v=5phx8eycHZ4")
}
