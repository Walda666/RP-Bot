const discord = require('discord.js');
const db = require('../db');
const config = require('../config.json')
const fx = require("./fonctions")
const { MessageMenuOption, MessageMenu, MessageActionRow } = require("discord-buttons")
module.exports = {
    run: async(message, args) => {
      message.delete()
      let utilisateur = fx.getUserById(message.author.id)
      let armes = fx.query(`SELECT A.nom, A.emoji, AU.id FROM placementarmes P JOIN armeutilisateur AU ON P.id = AU.arme JOIN armes A ON A.id = AU.arme WHERE AU.utilisateur = '${utilisateur}'`)
      if(armes.length == 0) return console.log(`SELECT A.nom, A.emoji, AU.id FROM placementarmes P JOIN armeutilisateur AU ON AU.id = P.arme JOIN armes A ON A.id = AU.arme WHERE AU.utilisateur = '${utilisateur}'`)

      let selection = new MessageMenu()
      .setID("menuposer")
      .setMaxValues(armes.length)
      .setMinValues(0)
      .setPlaceholder("Déposer des armes")

      for (i = 0; i < armes.length; i++) {
          let option = new MessageMenuOption()
              .setLabel(armes[i].nom)
              .setValue(armes[i].id.toString())
              .setEmoji("👉")
          selection.addOption(option)
      }

      let menuSend = await message.channel.send("Séléctionnez une ou plusieurs armes à poser ici.", selection)

      setTimeout(() => {
        if(!menuSend.deleted) menuSend.delete()
      }, 20000);

    },
    name: 'poser'
}