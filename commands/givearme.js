const discord = require('discord.js');
const db = require('../db');
const config = require('../config.json')
const fx = require("./fonctions")
module.exports = {
    run: (message, args) => {
      if(args.length < 5) return message.channel.send("manque des éléments")
      let personne = args[0].substring(3, 21)
      let armeNom = args[1]
      let armeDegats = args[2]
      let channela = args[3]
      let armeDesc = ""
      for(i = 4; i < args.length; i++) armeDesc += `${args[i]} `

      db.query(`SELECT id FROM armes ORDER BY id DESC`, function (err1, result1) {
        if(err1) throw err1
        let numArme = result1[0].id + 1

        db.query(`INSERT INTO armes(nom, degat, description, lieu) VALUES('${armeNom}', '${armeDegats}', '${armeDesc}', '1000')`, function (err2, result2) {
            if(err2) throw err2
        });

        db.query(`SELECT id, pseudo FROM utilisateur WHERE discordid = '${personne}'`, function (err3, result3) {
            if(err3) throw err3
            if(result3.length == 0) return message.channel.send("Utilisateur incorrect")
            let utilisateur = result3[0].id
            let pseudoMec = result3[0].pseudo


            db.query(`SELECT * FROM armeutilisateur WHERE utilisateur = '${utilisateur}' ORDER BY idByUSer DESC`, function (err5, result5) {
                if(err5) throw err5
                let idByuser = 0
                if(result5.length == 0) idByuser = 1
                else idByuser = result5[0].idByuser +1

            db.query(`INSERT INTO armeutilisateur(utilisateur, arme, idByUser) VALUES('${utilisateur}', '${numArme}', '${idByuser}')`, function (err4, result4) {
                if(err4) throw err4
            });
            
        });
        });
    });
    },
    name: 'givearme'
}