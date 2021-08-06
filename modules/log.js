var winston = require('winston')
require('winston-daily-rotate-file')

var transport = new winston.transports.DailyRotateFile({
  filename: './logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '6m'
})

transport.on('rotate', function(oldFilename, newFilename) {
  // do something fun
})

var logger = winston.createLogger({
  transports: [
    transport
  ]
})

let client
let getconfig
module.exports.start = function(client_, dirpath) {
    client = client_
    getconfig = require(dirpath + '/_config.js').getconfig
}
module.exports.log = function(text, guild, embeds) {
    if (text)
        if (guild) {
            const ntext = `[${guild.name}] ` + text
            console.log(ntext)
            logger.info(ntext)
        } else {
            console.log(text)
            logger.info(text)
        }
    if (guild) {
        getconfig(guild.id, 'LogChannel', function(channel) {
            if (channel && channel > 0) {
                chn = guild.channels.cache.get(channel)
                if (chn)
                    try {
                        chn.send(text, embeds = embeds)
                    } catch {logger("Failed to log")}
            }
        })
    }
}
