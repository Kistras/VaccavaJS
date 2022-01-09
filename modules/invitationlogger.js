const { MessageEmbed } = require("discord.js")

module.exports.start = function(client, dirpath) {
    const { getlang } = require(dirpath + '/_lang.js')
    const { getconfig } = require(dirpath + '/_config.js')
    const { log } = require(dirpath + '/modules/log.js')

    function constructJoining(data, member) {
        const ret = new MessageEmbed()
            .setColor(64150)
            .setTitle(getlang('user-joined-server', member.guild))
        ret.addField(getlang('user-joined-member', member.guild), `<@${member.id}>`)
        ret.addField(getlang('user-joined-link', member.guild), `https://discord.gg/${data.code}/`)
        ret.addField(getlang('user-joined-owner', member.guild), `<@${data.owner}>`)

        return ret
    }

    client.once('ready', () => {
        var inviteslog = {}
        function checkdisconnected(guild_, member) {
            try {
                guild_.fetch().then((guild) => {
                    const invites_ = guild.invites
                    if (!inviteslog[guild.id]) inviteslog[guild.id] = {}
                    invites_.fetch().then((invites) => {
                        var invitesnew = {}
                        invites.each((invite, id) => {
                            const data = {
                                owner: invite.inviter.id,
                                code: invite.code,
                                uses: invite.uses
                            }
                            if (inviteslog[guild.id][id]) 
                                if (inviteslog[guild.id][id].uses != invite.uses)
                                    if (member)
                                        log(null, guild, [constructJoining(data, member)])
                            
                            invitesnew[id] = data
                        })
                        for (key in inviteslog[guild.id]) {
                            if (!invitesnew[key])
                                if (member)
                                    log(null, guild, [constructJoining(inviteslog[guild.id][key], member)])
                        }
                        inviteslog[guild.id] = invitesnew
                    })
                })
            } catch (e) {
                console.log(`Couldn't check invites for ${_guild.id} cuz ${e}`)
            }
        }

        // Forcefully update each guild
        function updateGuilds() {
            client.guilds.fetch().then(guilds => {
                guilds.each(checkdisconnected)
            })
        }
        updateGuilds()
        setInterval(updateGuilds, 1000 * 60 * 5)

        // Add hooks
        client.on('guildMemberAdd', member => {
            checkdisconnected(member.guild, member)
            getconfig(member.guild.id, 'OnceJoinedRole', function(roleid) {
                if (roleid != 0) {
                    try {
                    member.guild.roles.fetch(roleid).then(role => {
                            member.roles.add(role)
                    })
                    } catch (e) {
                        console.log(`Attempted to give a role ${roleid} to a member ${member.id} (guild ${member.guild.id}), but got ${e}`)
                    }
                }
            })
        })

        client.on('inviteCreate', invite => {
            checkdisconnected(invite.guild)
        })
    })
}