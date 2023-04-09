const discord = require("discord.js")
const config = require("../config.json")
const db = require('../db')
const fx = require("./fonctions")

module.exports = {
    run: async (message, args, client) => {

        message.delete()
        if(args.length != 1) return
        let code = args[0]
        let channelId = message.channel.id
        let result = fx.query(`SELECT L.channel, LS.lieusecret FROM lieuxspeciaux LS JOIN lieux L ON LS.lieu = L.id WHERE LS.code = '${code}' AND L.channel = '${message.channel.id}'`)
        if(result.length == 0) return
        if(channelId != result[0].channel) return

        let result2 = fx.query(`SELECT channel FROM lieux WHERE id = '${result[0].lieusecret}'`)
        const chanAller = message.guild.channels.cache.get(result2[0].channel)
        chanAller.updateOverwrite(message.author, { VIEW_CHANNEL: true });
        message.channel.updateOverwrite(message.author, { VIEW_CHANNEL: false });
         
        fx.query(`UPDATE utilisateur SET emplacement = '${chanAller.id}' WHERE discordid = '${message.author.id}'`)

    },
    name: 'allerspecial'
}