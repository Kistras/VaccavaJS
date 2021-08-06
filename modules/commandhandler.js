module.exports.start = function(client, dirpath) {
    const importer = require(dirpath + "/_importer.js")
    const commands = importer.import(dirpath + '/modules/commands/')
    const {getconfig} = require(dirpath + '/_config.js')
    for (let key in commands) {
        if (commands[key].start) {
            commands[key].start(client, dirpath)
        }
    }

    client.on('message', msg => {
        if (!msg.content || msg.content.length < 2) return
        if (!(msg.guild)) return

        getconfig(msg.guild.id, 'Prefix', function(prefix) {
            if (msg.content.startsWith(prefix)) {
                const text = msg.content.slice(prefix.length)
                const splittext = text.split(' ')
                
                if (splittext[0].length === 0) 
                    splittext = splittext.slice(1)
                if (splittext.length === 0) return

                if (splittext[0] in commands) {
                    commands[splittext[0]].action(client, msg, splittext)
                }
            }
        })
    })
}
