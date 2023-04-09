const fx = require("./fonctions")
module.exports = {
    run: async (message, args) => {
        if(args.length != 1) return message.channel.send(fx.emb("Erreur", "Veuillez mettre le nombre de messages à supprimer", "RED"))

        await message.channel.bulkDelete(parseInt(args[0])+1)
        let coche = await message.channel.send("✅")
        setTimeout(() => {
            coche.delete()
        }, 3000);
    },
    name: 'delete'
}