import Discord, {
    Client,
    Intents,
    Message,
    MessageEmbed,
    TextChannel,
    DMChannel,
    NewsChannel,
    ThreadChannel
} from 'discord.js'
import { dirname } from "esm-dirname"
import path from 'path'
import fs from 'fs'
import stump from './logger.js'
import { _setClient, onInteractionCreate } from './events.js'
import Command, { InteractionResponse } from './commands.js'
import View from './view.js'
import State from './state.js'
import { getFile } from './utils.js'

global.__ConflictViewParser = View.createElement;

(async () => {

    TextChannel.prototype.view = function (view) { view.applyTo(this); };
    DMChannel.prototype.view = function (view) { view.applyTo(this); };
    NewsChannel.prototype.view = function (view) { view.applyTo(this); };
    ThreadChannel.prototype.view = function (view) { view.applyTo(this); };

    let config;
    try {
        config = await import(process.cwd() + '/conflict.config.js');
    } catch (err) {
        return stump.error('Missing conflict.config.js');
    }
    const { token, intents, errorHandler } = config.default;

    const client = new Client({ intents: (intents || ["GUILD_MESSAGES"]).map(intent => Intents.FLAGS[intent] ) });

    _setClient(client);

    client.on('ready', () => {
        stump.success('Logged in as ' + client.user.tag);
        initCommands();
    });

    client.login(token);

    async function initEvents () {
        let eventsPath = path.join(process.cwd(), '.conflict', 'build', 'events');
        if (fs.existsSync(eventsPath)) {
            let files = fs.readdirSync(eventsPath);
            let filePaths = files.map(file => path.join(eventsPath, file));
            for (const file of filePaths) {
                if (file.endsWith('.js') || file.endsWith('.cjs') || file.endsWith('.mjs')) await import(file);
            }
        }    
    }

    let commands = {};

    async function initCommands () {
        let previousGuilds = [];
        if (fs.existsSync(path.join(process.cwd(), '.conflict', '.guilds.commands.cache'))) {
            previousGuilds = fs.readFileSync(path.join(process.cwd(), '.conflict', '.guilds.commands.cache'), 'utf8').split('^');
        }

        let commandsPath = path.join(process.cwd(), '.conflict', 'build', 'commands');
        if (fs.existsSync(commandsPath)) {
            let files = fs.readdirSync(commandsPath);
            let filePaths = files.map(file => path.join(commandsPath, file));
            for (const file of filePaths) {
                if (file.endsWith('.js') || file.endsWith('.cjs') || file.endsWith('.mjs')) {
                    let fileData = await import(file);

                    if (fileData.default && fileData.default instanceof Command) {
                        let command = fileData.default;
                        commands[command.name] = command;
                    }
                }
            }
        }

        let publicCommands = [];
        let guildCommands = {};
        let guilds = [];

        for (const command in commands) {
            let commandData = commands[command];
            if (commandData.testing && commandData.testing.guildId) {
                if (!guildCommands[commandData.testing.guildId]) guildCommands[commandData.testing.guildId] = [];
                guilds.push(commandData.testing.guildId);
                guildCommands[commandData.testing.guildId].push({
                    name: commandData.name,
                    description: commandData.description,
                    options: commandData.options
                });
            } else {
                publicCommands.push({
                    name: commandData.name,
                    description: commandData.description,
                    options: commandData.options
                });
            }
        }

        previousGuilds = previousGuilds.filter(guild => !guilds.includes(guild));
        for (const guild of previousGuilds) {
            await client.api.applications(client.user.id).guilds(guild).commands.put({ data: [] });
        }

        fs.writeFileSync(path.join(process.cwd(), '.conflict', '.guilds.commands.cache'), guilds.join('^'), 'utf8');

        await client.api.applications(client.user.id).commands.put({
            data: publicCommands
        });
        for (const guild in guildCommands) {
            const commandsForGuild = guildCommands[guild];
            await client.api.applications(client.user.id).guilds(guild).commands.put({
                data: commandsForGuild
            });
        }

        onInteractionCreate(async interaction => {
            if (interaction.isCommand()) {
                if (commands[interaction.commandName]) {
                    let command = commands[interaction.commandName];
                    try {
                        let output = await command.execute(new InteractionResponse(interaction));
                        if (output instanceof Promise) output = await output;
                    } catch (err) {

                        console.error(err);
                        try {
                            if (errorHandler) return errorHandler(err, interaction);
                            const file = getFile(err);
                            interaction.reply({ embeds: [
                                new MessageEmbed()
                                    .setColor('#ff4444')
                                    .setTitle('Command Error')
                                    .setDescription(file + ' ```' + err.stack + '```')
                                    .setTimestamp()
                            ] });
                        } catch (nestedErr) {
                            if (errorHandler) return errorHandler(err, interaction);
                            interaction.channel.send(
                                new MessageEmbed()
                                    .setColor('#ff4444')
                                    .setTitle('Command Error')
                                    .setDescription('```' + err.stack + '```')
                                    .setTimestamp()
                            );
                        }
                    }
                } else {
                    interaction.reply({ embeds: [
                        new MessageEmbed()
                            .setColor('#ff4444')
                            .setTitle('Command Error')
                            .setDescription('```' + `Conflict Erorr: CommandNotFound` + '```')
                            .setTimestamp()
                    ] });
                }
            } else {
                let { customId } = interaction;
                interaction.reply({ embeds: [
                    new MessageEmbed()
                        .setColor('#ff4444')
                        .setTitle('Feature in Development')
                        .setDescription('```' + `Conflict Erorr: FeatureNotReady\n    at ${customId}.component:1:1` + '```')
                        .setTimestamp()
                ] });
            }
        });
    }

    async function init () {
        await initEvents();
    }

    init();
})();