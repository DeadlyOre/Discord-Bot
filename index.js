const Discord = require("discord.js")
require("dotenv").config()
const generateImage = require("./generateImage")

const client = new Discord.Client({

    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS"
    ]

})

let bot = {
    client,
    prefix: "g.",
    owners: [process.env.OWNERID]
}


client.commands = new Discord.Collection()
client.events = new Discord.Collection()
client.slashCommands = new Discord.Collection()

client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload)
client.loadCommands = (bot, reload) => require("./handlers/commands")(bot, reload)
client.loadSlashCommands = (bot, reload) => require("./handlers/slashCommands")(bot, reload)


client.loadEvents(bot, false)
client.loadCommands(bot, false)
client.loadSlashCommands(bot, false)

client.on('interactionCreate', (interaction) => {

    if (!interaction.isCommand()) return
    if (!interaction.inGuild()) return interaction.reply("This command can only be used in a server")

    const slashcmd = client.slashCommands.get(interaction.commandName)

    if (!slashcmd) return interaction.reply("invalid slash command")

    if (slashcmd.perm && !interaction.member.permissions.has(slashcmd.perm)) return interaction.reply('You do not haver permission for this command')

    slashcmd.run(client, interaction)

})

module.exports = bot

//------------------------------------------------------------------------
//idk how to work this into the framework, will figure it out eventually.

const welcomeChannelId = process.env.WELCOMECHANNEL

client.on("guildMemberAdd", async (member) => {

    const img = await generateImage(member)
    member.guild.channels.cache.get(welcomeChannelId).send({
        content: `<@${member.id}> Welcome to the server!`,
        files: [img]
    })

})
//--------------------------------------------------------------------------

client.login(process.env.TOKEN)