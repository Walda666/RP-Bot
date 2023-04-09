db = require('../db')
const Discord = require("discord.js");
const config = require('../config.json')
const fx = require("./fonctions")
module.exports = {
    run: (message, args) => {
        
        if(args.length != 2) return message.channel.send(fx.emb("Erreur", "Veuillez mettre le prénom de la personne et le channel d'arrivée en #", "RED"))

        let result = fx.query(`SELECT * FROM utilisateur WHERE prenom = '${args[0]}'`)
        if(result.length == 0) return message.channel.send(fx.emb("Erreur", "Personne non trouvé", "RED"))
        
        let channeldepart = message.guild.channels.cache.get(result[0].emplacement)
        let channelArrivee = message.guild.channels.cache.get(args[1].substring(2, 20));
        let personne = message.guild.members.cache.get(result[0].discordid);

        channeldepart.updateOverwrite(personne, { VIEW_CHANNEL: false });
        channelArrivee.updateOverwrite(personne, { VIEW_CHANNEL: true });
         
        let update = fx.query(`UPDATE utilisateur SET emplacement = '${channelArrivee.id}' WHERE discordid = '${personne.id}'`)
        
        if(update) message.react("✅")
    
    
    },
    name: 'tp'
}