db = require('../db')
const Discord = require("discord.js");
const config = require('../config.json')
const fx = require("./fonctions")
module.exports = {
    run: (message, args) => {
        message.delete()
        let result = fx.query(`SELECT image FROM utilisateur WHERE discordid = '${message.author.id}'`)        
        if(message.length != 0) message.channel.send(result[0].image)
    },
    name: 'me'
}