const discord = require("discord.js")
const configA = require("../config.json")
const syncSql = require("sync-sql")
const db = require("../db")
const { MessageMenuOption, MessageMenu, MessageActionRow } = require("discord-buttons")
module.exports = {
    config: {

        host: "localhost",
        user: "root",
        password: configA.mdp,
        database : "rp"
      },
      
    emb: function(titre, messag, couleur) {
        embed = new discord.MessageEmbed()
        .setColor(couleur)
        .setTitle(titre)
    
        .setDescription(`${messag}`)
        .setFooter(`RP`)
        return embed
    },

    pagin: function(message, pages, userr) {
        message.react("⬅️")
        message.react("➡️")
        const filter = (reaction, user) => true
        let compteur = 0
        const collector = message.createReactionCollector(filter, {max: 1});
        collector.on('collect', (reaction, user) => {
            if(reaction.emoji.name === "➡️" && !user.bot && user.id == userr.id) {
                message.reactions.resolve("➡️").users.remove(user)
                if(compteur == pages.length-1) {
                    message.edit(pages[0])
                    compteur = 0
                } else {
                    message.edit(pages[compteur+1])
                    compteur++
                }
            }
            if(reaction.emoji.name === "⬅️" && !user.bot && user.id == userr.id) {
                message.reactions.resolve("⬅️").users.remove(user)
                if(compteur == 0) {
                    message.edit(pages[pages.length-1])
                    compteur = pages.length -1
                } else {
                    message.edit(pages[compteur-1])
                    compteur--
                }
            }
        });
    },

    shuffleArray : function(tableau) {
        let nouveautab = []
        for (let j = tableau.length - 1; j >= 0; j--) {
            let random = Math.floor(Math.random() * tableau.length)
                nouveautab.push(tableau[random])
                tableau.splice(random, 1)
        }
        return nouveautab

    },

    query: function(query) {
        return syncSql.mysql(this.config, query).data.rows
    },

    createmenu: function(options, placeholder, emoji, menuid, max) {
        if(options.length <= 25) {
            let selection = new MessageMenu()
                .setID(menuid)
                .setMaxValues(max)
                .setMinValues(1)
                .setPlaceholder(placeholder)

                for (i = 0; i < options.length; i++) {
                    let option = new MessageMenuOption()
                        .setLabel(options[i][1])
                        .setValue(options[i][0])
                        .setEmoji(emoji)
                    selection.addOption(option)
                }

                return [selection]
            } else {
                let selection1 = new MessageMenu()
                .setID(menuid)
                .setMaxValues(max)
                .setMinValues(1)
                .setPlaceholder(placeholder)

                let selection2 = new MessageMenu()
                .setID(menuid)
                .setMaxValues(max)
                .setMinValues(1)
                .setPlaceholder(placeholder)

                for (i = 0; i < 25; i++) {
                    let option = new MessageMenuOption()
                        .setLabel(options[i][1])
                        .setValue(options[i][0])
                        .setEmoji(emoji)
                    selection1.addOption(option)
                }

                for (i = 25; i < options.length; i++) {
                    let option = new MessageMenuOption()
                        .setLabel(options[i][1])
                        .setValue(options[i][0])
                        .setEmoji(emoji)
                    selection2.addOption(option)
                }
                return [selection1, selection2]
            }
    },

    getLieuById(id) {
        let lieu =  this.query(`SELECT id FROM lieux WHERE channel = '${id}'`)
        console.log(lieu)
        if(lieu.length) return lieu[0].id
        else return console.log("PB")
    },

    getUserById(id) {
        let user =  this.query(`SELECT id FROM utilisateur WHERE discordid = '${id}'`)
        if(user.length) return user[0].id
        else return console.log("PB")
    },

    poser(menu) {
        let armes = menu.values
        if(armes.length == 0) return
        let armesposes = []
        let lieu = this.getLieuById(menu.channel.id)
        let lieup = this.query(`SELECT nom FROM lieux WHERE id = '${lieu}'`)[0].nom
        let prenom = this.query(`SELECT prenom FROM utilisateur WHERE discordid = '${menu.clicker.id}'`)[0].prenom

        for(i = 0; i < armes.length; i++) {
            let arme = this.query(`SELECT arme FROM armeutilisateur WHERE id = '${armes[i]}'`)[0].arme
            let armep = this.query(`SELECT A.nom FROM placementarmes P JOIN armes A ON A.id = P.arme WHERE P.id = '${arme}'`)
            armesposes.push(armep[0].nom)
            this.query(`DELETE FROM armeutilisateur WHERE id = '${armes[i]}'`)
            this.query(`UPDATE placementarmes SET lieu = '${lieu}' WHERE id = '${arme}'`)
        }
        menu.message.delete()
        
        let chanlogs = this.client.guilds.cache.get(configA.guild).channels.cache.get(configA.chanlogs)
        chanlogs.send(this.emb("Arme(s) déposée(s)", `**${prenom}** a posé **${armesposes.join(", ")}** dans le lieu **${lieup}** !`, "PURPLE"))

    },

    prendre: function(menu) {
        let armes = menu.values
        if(armes.length == 0) return
        let armesprises = []
        let lieup = this.query(`SELECT nom FROM lieux WHERE channel = '${menu.channel.id}'`)[0].nom
        let utilisateur = this.getUserById(menu.clicker.id)
        let prenom = this.query(`SELECT prenom FROM utilisateur WHERE discordid = '${menu.clicker.id}'`)[0].prenom

        for(i = 0; i < armes.length; i++) {
            this.query(`INSERT INTO armeutilisateur(arme, utilisateur) VALUES('${armes[i]}', '${utilisateur}')`)
            this.query(`UPDATE placementarmes SET lieu = 0 WHERE id = '${armes[i]}'`)
            let arme = this.query(`SELECT A.nom FROM placementarmes P JOIN armes A ON A.id = P.arme WHERE P.id = '${armes[i]}'`)
            armesprises.push(arme[0].nom)
        }

        menu.message.delete()
        
        let chanlogs = this.client.guilds.cache.get(configA.guild).channels.cache.get(configA.chanlogs)
        chanlogs.send(this.emb("Arme(s) prise(s)", `**${prenom}** a prit **${armesprises.join(", ")}** dans le lieu **${lieup}** !`, "PURPLE"))
        
    },

    client : "rien",

    setClient: function(client) {
        this.client = client
    },


    name: "fonction"

}