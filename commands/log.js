const discord = require('discord.js');
const db = require('../db');
const fx = require("./fonctions")
module.exports = {
    run: (message, args) => {
        message.delete()
        const currentChan = message.channel.id
       db.query(`SELECT * FROM lieux WHERE channel = '${currentChan}'`, function (err10, result10) {
         if(err10) throw err10
         if(result10.length != 0) return message.channel.send("déjà log")
         db.query(`INSERT INTO lieux(nom, channel) VALUES('${message.channel.name}', '${currentChan}')`, function (err1, result1) {
            if(err1) throw err1
            message.channel.send("Good")
            .then(msg => {
                setTimeout(() => msg.delete(), 2000)
              })
         });
       });
    },
    name: 'log'
}