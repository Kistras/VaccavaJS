module.exports.start = function(client, dirpath) {
    const {getconfig} = require(dirpath + '/_config.js')
    
    client.on("voiceStateUpdate", (oldstate, newstate) => {
        //console.log(oldstate, newstate, "\n---")
        // If joined
        getconfig(newstate.guild.id, null, function (guildConfig) {
            if (!guildConfig["TempVoiceChannel"] || !guildConfig["TempVoiceCategory"]) return
            if (oldstate.channelID !== newstate.channelID) {
                // Guild in oldstate and newstate should be the same
                const cache = newstate.guild.channels.cache
                let createcategory = cache.get(guildConfig["TempVoiceCategory"])
                if (!createcategory) return

                let oldchannel
                let newchannel
                // Moved from other channel
                // Otherwise came from nowhere
                if (oldstate.channelID) {
                    oldchannel = cache.get(oldstate.channelID)
                }
                // Moved into other channel
                // Otherwise just leaved
                if (newstate.channelID) {
                    newchannel = cache.get(newstate.channelID)
                }

                if (newchannel && guildConfig["TempVoiceChannel"] == newstate.channelID) {
                    newstate.guild.channels.create('new', {
                        type: 'VOICE', // why
                        // Why does this link tells me to use VOICE_GUILD https://discord.js.org/#/docs/main/stable/typedef/ChannelType
                        // AND SOME OTHER CODE TELLS ME TO USE JUST VOICE AND ONLY ONE OF THEM WORKS DSAJFHASDLIFGASDLFHASLDF
                        parent: createcategory,
                        position: 0, // Position works from bottom to top. Why
                        reason: 'Automatic creation of temp voice channels'
                    })
                    .then(channel => {newstate.setChannel(channel, 'Automatic creation of temp voice channels')})
                }

                if (oldchannel && guildConfig["TempVoiceChannel"] != oldstate.channelID) {
                    if (guildConfig["TempVoiceCategory"] == oldchannel.parentID) {
                        oldchannel.fetch().then(sugchannel => {
                            if (!(sugchannel.members.first())) {
                                sugchannel.delete('Automatic removal of temp voice channels')
                            }
                        })
                    }
                }
            }
        })
    })
}
