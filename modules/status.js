module.exports.start = function(client, dirpath) {
    client.once("ready", () => {
        client.user.setPresence({
            activities: [
                {name: `Wanting to die`}
            ], 
            status: 'online'}
        )
    })
}
