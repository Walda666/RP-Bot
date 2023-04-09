db = require('../db')
const Discord = require("discord.js");
const config = require('../config.json')
const fx = require("./fonctions")
module.exports = {
    run: (message, args) => {
        
        let embed = new Discord.MessageEmbed()
        .setTitle("Help")
        .setDescription(`addu : s'enregistrer sur le bot

aller : fait apparaitre les lieux disponibles (puis mettre une réaction pour celui voulu)

armes : affiche les armes se trouvant dans la pièce

inv : affiche les armes sur soi (tout le monde voit donc faites le sur votre carnet)

poser : pose une arme de son inventaire dans la pièce

prendre prend une arme présente dans la pièce

Les menus de poser/prendre disparaissent au bout de 20 secondes si vous ne faites rien`)

message.channel.send(embed)
    },
    name: 'help'
}