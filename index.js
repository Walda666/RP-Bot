const Discord = require("discord.js");
const db = require("./db");
const config = require('./config.json');
const fx = require("./commands/fonctions")

const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_PRESENCES] });
fs = require('fs')
require("discord-buttons")(client)

client.login(config.token);
client.commands = new Discord.Collection()

fs.readdir('./commands', (err, files) => {
    if(err) throw err
    files.forEach(file => {
        if(!file.endsWith('.js')) return
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    })
})

client.on('message', message => {
    if(message.type !== 'DEFAULT' || message.author.bot) return
    const args = message.content.trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    if(!commandName.startsWith(config.prefix)) return
    const command = client.commands.get(commandName.slice(config.prefix.length))
    if(!command) return
    command.run(message, args, client)
});


client.on('clickMenu', async (menu) => {
    if(menu.id == "menuposer") fx.poser(menu)
    if(menu.id == "menuprendre") fx.prendre(menu)

	//console.log(menu.id, menu.values, menu.clicker.id)
});


client.on('messageReactionAdd', (reaction, user) => {
    if(user.bot) return
    const currentChan = reaction.message.channel.id
    db.query(`SELECT id FROM lieux WHERE channel = '${currentChan}'`, function (err, result) {
        if(err) throw err
        let idCurrentChan = result[0].id
        db.query(`SELECT * FROM connexion WHERE lieu1 = ${idCurrentChan}`, function (err2, result2) {
            let tab = []
            for(i = 0; i < result2.length; i++) tab.push(result2[i].lieu2)
            let tableau = []
            let compteur = 0
            for(i = 0; i < tab.length; i++) {
                db.query(`SELECT * FROM lieux WHERE id = ${tab[i]}`, function (err3, result3) {
                    compteur++
                    if(err3) throw err3
                    tableau.push(result3[0].channel)
                    if(compteur == tab.length) {
                        let numreac = 0
                        let tableauReacs = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣", "7️⃣","8️⃣","9️⃣"]
                        if(reaction.emoji.name == "1️⃣") numreac = 1
                        if(reaction.emoji.name == "2️⃣") numreac = 2
                        if(reaction.emoji.name == "3️⃣") numreac = 3
                        if(reaction.emoji.name == "4️⃣") numreac = 4
                        if(reaction.emoji.name == "5️⃣") numreac = 5
                        if(reaction.emoji.name == "6️⃣") numreac = 6
                        if(reaction.emoji.name == "7️⃣") numreac = 7
                        if(reaction.emoji.name == "8️⃣") numreac = 8
                        if(reaction.emoji.name == "9️⃣") numreac = 9
                        if(numreac != 0) {
                        let chan = reaction.message.channel
                        chan.updateOverwrite(user, { VIEW_CHANNEL: false });
                        reaction.message.guild.channels.cache.get(`${tableau[numreac-1]}`).updateOverwrite(user, { VIEW_CHANNEL: true });
                        reaction.message.reactions.resolve(tableauReacs[numreac-1]).users.remove(user)
                        db.query(`UPDATE utilisateur SET emplacement = '${tableau[numreac-1]}' WHERE discordid = '${user.id}'`, function (err4, result4) {
                            if(err4) throw err4
                        });
                    }
                    }
                });
            }
            });
    });
})



client.once('ready',  () => {
    fx.setClient(client)
    console.log("Good !");
    client.user.setActivity("Cette partie d'échec est bien compliquée..")
});