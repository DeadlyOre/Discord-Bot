const Discord = require("discord.js")
require("dotenv").config()

const client = new Discord.Client({

    intents: [
        "GUILDS"
    ]

})

let bot = {
    client
}

const guildId = '952645205151084574'


client.slashCommands = new Discord.Collection()
client.loadSlashCommands = (bot, reload) => require("./handlers/slashCommands")(bot, reload)
client.loadSlashCommands(bot, false)


client.on('ready', async () => {
    const guild = client.guilds.cache.get(guildId)
    if (!guild)
        return console.error("Target guild not found")
    
    await guild.commands.set([...client.slashCommands.values()])
    console.log(`successfully loaded in ${client.slashCommands.size} slash commands`)
    process.exit(0)
})

client.login(process.env.TOKEN)