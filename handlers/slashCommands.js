const fs = require('fs')
const { getFiles } = require('../util/functions')

module.exports = (bot, reload) => {
    const { client } = bot

    let slashCommands = getFiles('./slashCommands/', '.js')

    if (slashCommands.length == 0) console.log("no slash commands loaded")

    slashCommands.forEach(f =>{
        if (reload) delete require.cache[require.resolve(`../slashCommands/${f}`)]
        const slashcmd = require(`../slashCommands/${f}`)
        client.slashCommands.set(slashcmd.name, slashcmd)
    })
}