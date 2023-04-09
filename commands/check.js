const db = require('../db')
const discord = require('discord.js')
const fx = require("./fonctions")
module.exports = {
    run: (message, args) => {
        if(args.length != 1) return message.channel.send(fx.emb("Erreur", "Veuillez mettre un prénom", "RED"))

        let result = fx.query(`SELECT * FROM utilisateur WHERE prenom = '${args[0]}'`)
        if(result.length == 0) return message.channel.send("Personne non trouvé (il faut mettre le prénom)")
        let inventaire = ''
        let result2 = fx.query(`SELECT A.emoji, A.nom, A.description FROM placementarmes P JOIN armes A ON A.id = P.arme JOIN armeutilisateur AU ON AU.arme = P.id JOIN utilisateur U ON U.id = AU.utilisateur WHERE U.prenom = '${args[0]}' ORDER BY AU.id ASC`)
        if(result2.length == 0) inventaire += "vide"
        else {
            for(i = 0; i  < result2.length; i++) inventaire += `**·** :${result2[i].emoji}: ${result2[i].nom} ${result2[i].description}\n\n`
        }

        let embed = new discord.MessageEmbed()
        .setTitle(`État ${result[0].prenom}`)
        .setDescription(`            
Lieu actuel : <#${result[0].emplacement}>

Inventaire :

${inventaire}

Accéder au channel perso : <#${result[0].channel}>
    `)
.setImage(result[0].image)

        message.channel.send(embed)


    },
    name: 'check'
}