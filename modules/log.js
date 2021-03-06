var winston = require('winston')
require('winston-daily-rotate-file')

var transport = new winston.transports.DailyRotateFile({
  filename: `${__dirname.replace('\\', '/')}/logs/%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '12m'
})

transport.on('rotate', function(oldFilename, newFilename) {
  // do something fun
})

const { combine, timestamp, prettyPrint } = winston.format
var logger = winston.createLogger({
  transports: [
    transport
  ],
  format: combine(
    timestamp(),
    prettyPrint()
  ),
})
logger.info('Started')
let client
let getconfig
module.exports.start = function(client_, dirpath) {
    client = client_
    getconfig = require(dirpath + '/_config.js').getconfig
    logger.info('Loaded')
}
module.exports.log = function(text, guild, embeds_) {
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
                let chn = guild.channels.cache.get(channel)
                if (chn)
                    try {
                        if (embeds_) 
                            chn.send({embeds: embeds_})
                            .catch(e => {console.log(`Failed to log for guild.id: ${e}`)})
                        else
                            chn.send(text)
                    } catch {logger("Failed to log")}
            }
        })
    }
}
