db = require('../db')
const fx = require("./fonctions")
module.exports = {
    run: (message, args) => {
        
        let result = fx.query(`SELECT * FROM utilisateur WHERE discordid = '${message.author.id}'`)
        if(result.length) return message.channel.send(fx.emb("Erreur", `${message.author} Vous êtes déjà inscrit`, "RED"))
        let insert = fx.query(`INSERT INTO utilisateur(discordid, prenom, channel, role) VALUES ('${message.author.id}', '${message.author.username}', '${message.channel.id}', '0')`)
        if(insert) message.react("✅")
    },
    name: 'addu'
}