const fx = require("./fonctions")
module.exports = {
    run: async (message, args) => {
        if(args.length != 1) return message.channel.send(fx.emb("Erreur", "Veuillez mettre le nombre maximal à roll", "RED"))

        let random = Math.floor(Math.random() * parseInt(args[0]))+1
        console.log(random)
        let embed = fx.emb("Roll", `Le résultat de ton lancé est **${random}** !`)

        message.channel.send(embed)

        console.log(message.channel.threads)
        /*
        const thread = await message.channel.threads.create({
            name: `uwu`,
            autoArchiveDuration: 60,
            reason: `Combat ${message.author.username}`,
        });
*/
    },
    name: 'roll'
}