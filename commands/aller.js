const discord = require('discord.js');
const db = require('../db');
const fx = require("./fonctions")
module.exports = {
    run: async (message, args) => {
        message.delete()
        let desc = ""
        
        let idChan = fx.getLieuById(message.channel.id)
        let lieux = fx.query(`SELECT * FROM connexion WHERE lieu1 = '${idChan}'`)
        if(lieux.length == 0) return("nope")
        for(i = 0; i < lieux.length; i++) {
            let lieuActu = fx.query(`SELECT * FROM lieux WHERE id = '${lieux[i].lieu2}}'`)

            let nomSalle = lieuActu[0].nom[0].toUpperCase() + lieuActu[0].nom.substring(1).replace("-", " ")
            desc += `${i+1}.   ${nomSalle}\n\n`
        }

        let embed = await message.channel.send(fx.emb("Lieux", desc, "BLUE"))
        if(lieux.length > 0) embed.react("1️⃣")
        if(lieux.length > 1) embed.react("2️⃣")
        if(lieux.length > 2) embed.react("3️⃣")
        if(lieux.length > 3) embed.react("4️⃣")
        if(lieux.length > 4) embed.react("5️⃣")
        if(lieux.length > 5) embed.react("6️⃣")
        if(lieux.length > 6) embed.react("7️⃣")
        if(lieux.length > 7) embed.react("8️⃣")
        if(lieux.length > 8) embed.react("9️⃣")
        setTimeout(() => {
            embed.delete()
        }, 1000*12);  

    },
    name: 'aller'
}