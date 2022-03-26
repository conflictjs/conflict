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
import events, { _setClient, onInteractionCreate, onDebug, onReady } from './events.js'
import Command, { InteractionResponse } from './commands.js'
import View from './view.js'
import State, { managers } from './state.js'
import { REST } from '@discordjs/rest'
// const { REST } = djsrest;
import typesv9 from 'discord-api-types/v9'
const { Routes } = typesv9;
import { getFile, cleanLines } from './utils.js'

global.__ConflictViewParser = View.createElement;

if (!global.__ConflictENV) global.__ConflictENV = {};

(async () => {

    TextChannel.prototype.view = function (view) { view.applyTo(this); };
    DMChannel.prototype.view = function (view) { view.applyTo(this); };
    NewsChannel.prototype.view = function (view) { view.applyTo(this); };
    ThreadChannel.prototype.view = function (view) { view.applyTo(this); };

    if (process.env.CONFLICT_VERBOSE) global.__ConflictENV.verbose = true;

    let config;
    try {
        config = await import(process.cwd() + '/conflict.config.js');
    } catch (err) {
        return stump.error('Missing conflict.config.js');
    }
    let { token, intents, errorHandler, plugins } = config.default;
    if (!plugins) plugins = [];

    const rest = new REST({ version: '9' }).setToken(token);

    const client = new Client({ intents: (intents || ["GUILD_MESSAGES"]).map(intent => Intents.FLAGS[intent] ) });

    _setClient(client);

    if (process.env.CONFLICT_VERBOSE === "TRUE") onDebug(message => {
        stump.verbose(message);
    });

    onReady(() => {
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
            previousGuilds = fs.readFileSync(path.join(process.cwd(), '.conflict', '.guilds.commands.cache'), 'utf8').split('^').filter(guild => guild).map(guild => guild.trim()).filter(guild => guild);
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
                    options: commandData.options,
                    name_localizations: commandData.name_localizations,
                    description_localizations: commandData.description_localizations
                });
            } else {
                publicCommands.push({
                    name: commandData.name,
                    description: commandData.description,
                    options: commandData.options,
                    name_localizations: commandData.name_localizations,
                    description_localizations: commandData.description_localizations
                });
            }
        }

        previousGuilds = previousGuilds.filter(guild => !guilds.includes(guild));
        for (const guild of previousGuilds) {
            await rest.put(Routes.applicationGuildCommands(client.user.id, guild), { body: [] });
        }

        fs.writeFileSync(path.join(process.cwd(), '.conflict', '.guilds.commands.cache'), guilds.join('^'), 'utf8');

        setTimeout(async () => {
            await rest.put(Routes.applicationCommands(client.user.id), { body: publicCommands })
        }, 30000);

        for (const guild in guildCommands) {
            const commandsForGuild = guildCommands[guild];
            await rest.put(Routes.applicationGuildCommands(client.user.id, guild), { body: commandsForGuild })
        }

        managers.components.select('*').statelessLoad();

        onInteractionCreate(async interaction => {
            if (interaction.isCommand()) {
                if (commands[interaction.commandName]) {
                    let command = commands[interaction.commandName];
                    try {
                        let output = await command.execute(new InteractionResponse(interaction));
                        if (output instanceof Promise) output = await output;
                    } catch (err) {

                        stump.error(err);
                        try {
                            if (errorHandler) return errorHandler(err, interaction);
                            const file = getFile(err);
                            interaction.reply({ embeds: [
                                new MessageEmbed()
                                    .setColor('#ff4444')
                                    .setTitle('Command Error')
                                    .setDescription(file + ' ```' + cleanLines(err.stack, 4) + '```')
                                    .setTimestamp()
                            ] });
                        } catch (nestedErr) {
                            
                            stump.error('Conflict had a hard time figuring this one out.', nestedErr);
                            if (errorHandler) return errorHandler(err, interaction);
                            try {
                                interaction.channel.send(
                                    new MessageEmbed()
                                        .setColor('#ff4444')
                                        .setTitle('Command Error')
                                        .setDescription('```' + err.stack + '```')
                                        .setTimestamp()
                                );
                            } catch (nestedNestedErr) {
                                stump.error('Nested error handling failed.');
                            }
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
                let code = managers.components.select('*').fetch(customId);
                if (code) {
                    try {
                        let output = await code(new InteractionResponse(interaction));
                        if (output instanceof Promise) output = await output;
                    } catch (err) {
                        stump.error(err);
                        try {
                            if (errorHandler) return errorHandler(err, interaction);
                            const file = getFile(err);
                            interaction.reply({ embeds: [
                                new MessageEmbed()
                                    .setColor('#ff4444')
                                    .setTitle('Command Error')
                                    .setDescription(file + ' ```' + cleanLines(err.stack, 4) + '```')
                                    .setTimestamp()
                            ] });
                        } catch (nestedErr) {
                            
                            stump.error('Conflict had a hard time figuring this one out.', nestedErr);
                            if (errorHandler) return errorHandler(err, interaction);
                            try {
                                interaction.reply(
                                    new MessageEmbed()
                                        .setColor('#ff4444')
                                        .setTitle('Command Error')
                                        .setDescription('```' + err.stack + '```')
                                        .setTimestamp()
                                );
                            } catch (nestedNestedErr) {
                                stump.error('Nested error handling failed.');
                            }
                        }
                    }
                } else {
                    interaction.reply({ embeds: [
                        new MessageEmbed()
                            .setColor('#ff4444')
                            .setTitle('Button Expired')
                            .setDescription('This button is expired.')
                            .setTimestamp()
                    ] });
                } 
            }
        });
        client.ws.on('INTERACTION_CREATE', async (apiInteraction) => {
            if (apiInteraction.type !== 5) return;
            let interaction = new Discord.CommandInteraction(client, apiInteraction);
            interaction.customId = apiInteraction.data.custom_id;
            interaction.components = apiInteraction.data.components;
            interaction.isModalSubmit = true;
            let { customId } = interaction;
            let code = managers.components.select('*').fetch(customId);
            if (code) {
                try {
                    let output = await code(new InteractionResponse(interaction));
                    if (output instanceof Promise) output = await output;
                } catch (err) {
                    stump.error(err);
                    try {
                        if (errorHandler) return errorHandler(err, interaction);
                        const file = getFile(err);
                        interaction.reply({ embeds: [
                            new MessageEmbed()
                                .setColor('#ff4444')
                                .setTitle('Command Error')
                                .setDescription(file + ' ```' + cleanLines(err.stack, 4) + '```')
                                .setTimestamp()
                        ] });
                    } catch (nestedErr) {
                        
                        stump.error('Conflict had a hard time figuring this one out.', nestedErr);
                        if (errorHandler) return errorHandler(err, interaction);
                        try {
                            interaction.reply(
                                new MessageEmbed()
                                    .setColor('#ff4444')
                                    .setTitle('Command Error')
                                    .setDescription('```' + err.stack + '```')
                                    .setTimestamp()
                            );
                        } catch (nestedNestedErr) {
                            stump.error('Nested error handling failed.');
                        }
                    }
                }
            } else {
                interaction.reply({ embeds: [
                    new MessageEmbed()
                        .setColor('#ff4444')
                        .setTitle('Button Expired')
                        .setDescription('This button is expired.')
                        .setTimestamp()
                ] });
            }
        });
    }

    async function init () {
        await initEvents();
        for (const plugin of plugins) {
            plugin({
                stump,
                logger: stump,
                events,
                View,
                State,
                config,
                client
            });
        }
    }

    init();
})();