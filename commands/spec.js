const discord = require('discord.js');
const db = require('../db');
const config = require('../config.json')
module.exports = {
    run: async (message, args) => {
      if(args.length != 1) return message.channel.send("no")
      let personne = await message.guild.members.cache.get(args[0]);
      let result = fx.query(`SELECT channel FROM lieux WHERE carnet IS null`)
     
      for(i = 0; i < result.length; i++) {
        let chan = message.guild.channels.cache.get(result[i].channel);
        await chan.permissionOverwrites.edit(personne, { VIEW_CHANNEL: true });
        await chan.permissionOverwrites.edit(personne, { SEND_MESSAGES: false });
      }
    },
    name: 'spec'
}