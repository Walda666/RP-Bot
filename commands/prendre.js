const discord = require('discord.js');
const db = require('../db');
const config = require('../config.json')
const fx = require("./fonctions")
const { MessageMenuOption, MessageMenu, MessageActionRow } = require("discord-buttons")
module.exports = {
    run: async (message, args) => {
      message.delete()
      let armes = fx.query(`SELECT PA.id, A.nom FROM placementarmes PA JOIN lieux L ON L.id = PA.lieu JOIN armes A ON A.id = PA.arme WHERE L.channel  = '${message.channel.id}'`)
      if(armes.length == 0) return

      let selection = new MessageMenu()
      .setID("menuprendre")
      .setMaxValues(armes.length)
      .setMinValues(0)
      .setPlaceholder("Prendre des armes")

      for (i = 0; i < armes.length; i++) {
          let option = new MessageMenuOption()
              .setLabel(armes[i].nom)
              .setValue(armes[i].id.toString())
              .setEmoji("👉")
          selection.addOption(option)
      }

      let menuSend = await message.channel.send("Séléctionnez une ou plusieurs armes à récupérer.", selection)

      setTimeout(() => {
        if(!menuSend.deleted) menuSend.delete()
      }, 20000);

    },
    name: 'prendre'
}