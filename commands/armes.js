const discord = require('discord.js');
const db = require('../db');
const fx = require("./fonctions")
module.exports = {
    run: async (message, args) => {
      message.delete()
      let result = fx.query(`SELECT A.nom, A.description, A.emoji FROM placementarmes PA JOIN lieux L ON L.id = PA.lieu JOIN armes A ON A.id = PA.arme WHERE L.channel  = '${message.channel.id}'`)
      //.setTitle(`Armes - ${message.channel.name}`)
      let description = ""
      tab = []
      for(i = 0; i < result.length; i++) tab.push([i+1, result[i].emoji, result[i].nom, result[i].description])
      if(tab.length == 0) description = "Il n'y a pas d'armes ici"
      for(i = 0; i < tab.length; i++) description += `${tab[i][0]} · :${tab[i][1]}: ${tab[i][2]} - ${tab[i][3]}\n\n`
      let embed = await message.channel.send(fx.emb(`Armes - ${message.channel.name}`, description, "BLACK"))
      setTimeout(() => {
        if(embed) embed.delete()
      }, 15000);

    },
    name: 'armes'
}