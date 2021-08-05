module.exports.start = function(client, dirpath) {
    const importer = require(dirpath + "/_importer.js")
    const commands = importer.import(dirpath + '/modules/commands/')
    for (let key in commands) {
        if (commands[key].start) {
            commands[key].start(client, dirpath)
        }
    }

    client.on('message', msg => {
        if (!msg.content || msg.content.length < 2) return
        const text = msg.content.toLowerCase()
        const splittext = text.split(' ')
        if (splittext[0] in commands) {
            commands[splittext[0]].action(client, msg, splittext)
        }
    })
}
