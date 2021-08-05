module.exports.start = function(client, dirpath) {
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`)
    })
}
