module.exports.start = function(client, dirpath) {
    client.on('message', msg => {
        if (msg.content === 'ping') {
            msg.channel.send('I love bacon')
        }
    })
}
