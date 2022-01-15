module.exports.start = function(client, dirpath) {
    const {getconfig} = require(dirpath + '/_config.js')
    
    client.on("voiceStateUpdate", (oldstate, newstate) => {
        if (!newstate.guild.available) return
        //console.log(oldstate, newstate, "\n---")
        // If joined
        getconfig(newstate.guild.id, null, async function (guildConfig) {
            if (!guildConfig["TempVoiceChannel"] || !guildConfig["TempVoiceCategory"]) return
            if (guildConfig["TempVoiceChannel"] == 0 || guildConfig["TempVoiceCategory"] == 0) return
            if (oldstate.channelId !== newstate.channelId) {
                // Guild in oldstate and newstate should be the same
                const cache = newstate.guild.channels
                let createcategory = await cache.fetch(guildConfig["TempVoiceCategory"])
                if (!createcategory) return

                let oldchannel
                let newchannel
                // Moved from other channel
                // Otherwise came from nowhere
                if (oldstate.channelId) {
                    oldchannel = await cache.fetch(oldstate.channelId)
                }
                // Moved into other channel
                // Otherwise just leaved
                if (newstate.channelId) {
                    newchannel = await cache.fetch(newstate.channelId)
                }

                if (newchannel && guildConfig["TempVoiceChannel"] == newstate.channelId) {
                    let member = await newstate.member.fetch()
                    newstate.guild.channels.create(member.nickname, {
                        type: 'GUILD_VOICE', // why
                        // Why does this link tells me to use VOICE_GUILD https://discord.js.org/#/docs/main/stable/typedef/ChannelType
                        // AND SOME OTHER CODE TELLS ME TO USE JUST VOICE AND ONLY ONE OF THEM WORKS DSAJFHASDLIFGASDLFHASLDF
                        // UPD 01.16.22: THEY FUCKING CHANGED VOICE_GUILD TO GUILD_VOICE, CHANGED ONE SYMBOL IN CHANNELID AND "VOICE" ISN'T WORKING ANYMORE. I WANT TO DIE
                        parent: createcategory,
                        position: 6661337, // Position works from bottom to top. Why
                        // UPD 01.16.22: __NOW__ POSITION WORKS FROM TOP TO BOTTOM WTFH
                        reason: 'Automatic creation of temp voice channels'
                    })
                    .then(channel => {newstate.setChannel(channel, 'Automatic creation of temp voice channels')})
                }

                if (oldchannel && guildConfig["TempVoiceChannel"] != oldstate.channelId) {
                    if (guildConfig["TempVoiceCategory"] == oldchannel.parentId) {
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
