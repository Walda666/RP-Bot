const discord = require('discord.js');
const db = require('../db');
const fx = require("./fonctions")
module.exports = {
    run: (message, args) => {
      let result = fx.query(`SELECT A.emoji, A.nom, A.description FROM placementarmes P JOIN armes A ON A.id = P.arme JOIN armeutilisateur AU ON AU.arme = P.id JOIN utilisateur U ON U.id = AU.utilisateur WHERE U.discordid = '${message.author.id}' ORDER BY AU.id ASC`)
         let inventaire = ''
         if(result.length == 0) inventaire += "vide"
          else {
              for(i = 0; i  < result.length; i++) inventaire += `**·** :${result[i].emoji}: ${result[i].nom} ${result[i].description}\n\n`
          }
         message.channel.send(fx.emb(`Armes - ${message.author.username}`, inventaire, "BLACK"))
    },
    name: 'inv'
}