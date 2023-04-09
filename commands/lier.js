const discord = require('discord.js');
const db = require('../db');
const fx = require("./fonctions")
module.exports = {
    run: (message, args) => {
        if(args.length != 1) return message.channel.send("met un chan stp (un seul)")
        const chanLier = args[0].substring(2, 20)
        message.delete()
        const currentChan = message.channel.id
        db.query(`SELECT * FROM lieux WHERE channel = '${currentChan}'`, function (err10, result10) {
            if(err10) throw err10
            let idCurrentChan = result10[0].id

            db.query(`SELECT * FROM lieux WHERE channel = '${chanLier}'`, function (err1, result1) {
                if(err1) throw err1
                if(result1.length == 0) return message.channel.send("le chan à lier n'est pas log (,log dans celui-ci)")
                let idChanLier = result1[0].id

                db.query(`SELECT * FROM connexion WHERE lieu1 = '${idCurrentChan}' AND lieu2 = '${idChanLier}' OR lieu1 = '${idChanLier}' AND lieu2 = '${idCurrentChan}'`, function (err2, result2) {
                    if(err2) throw err2
                    if(result2.length != 0) return message.channel.send("déjà lié")

                    db.query(`INSERT INTO connexion(lieu1, lieu2) VALUES('${idChanLier}', '${idCurrentChan}'), ('${idCurrentChan}', '${idChanLier}')`, function (err3, result3) {
                        if(err3) throw err3
                        message.channel.send("Good")
                        .then(msg => {
                            setTimeout(() => msg.delete(), 2000)
                        })
                    });
                });
            });
       });
    },
    name: 'lier'
}