// dispatch.js
// Handles Discord interaction only; a complete level of abstraction above the server.

import DiscordInteractions from 'discord-interactions';
const {
    InteractionResponseType,
    InteractionType,
    verifyKey,
} = DiscordInteractions;

import path from 'path';
import Command, { InteractionResponse } from '@conflict/beta/commands';
import View, { parseView } from '@conflict/beta/view';
global.__ConflictViewParser = View.createElement;
global.__ConflictEnvironment = 'vercel';
import Discord from 'discord.js';
const {
    AutocompleteInteraction,
    ButtonInteraction,
    CommandInteraction,
    SelectMenuInteraction,
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    MessageEmbed,
    Constants
} = Discord;
const { Events, InteractionTypes, MessageComponentTypes, ApplicationCommandTypes } = Constants;

import fs from 'fs';
import fetch from 'node-fetch';
const { all } = JSON.parse(fs.readFileSync('commands.json', 'utf8'));

const commands = all;

function status (...args) {
    if (args.length === 0) return { ___status: true, status: 200, payload: args[0] };
    let code = 200, payload = {};

    if ((args[0] + '').length === 3) {
        code = args[0];
        payload = args[1];
    } else {
        payload = args[0];
        code = args[1];
    }

    return {
        ___status: true, status: code, payload
    }
}

export default async function (message) {
    if (message.type === InteractionType.APPLICATION_COMMAND || true) {
        const data = message;
        const client = generateClient(process.env.TOKEN);

// lmaoooo stolen from https://github.com/discordjs/discord.js/blob/033151cf92fe43536b8a4c0f4d7d9ed75a2095c5/packages/discord.js/src/client/actions/InteractionCreate.js



        let InteractionType;
        switch (data.type) {
          case InteractionTypes.APPLICATION_COMMAND:
            switch (data.data.type) {
              case ApplicationCommandTypes.CHAT_INPUT:
                InteractionType = CommandInteraction;
                break;
              case ApplicationCommandTypes.USER:
                InteractionType = UserContextMenuCommandInteraction;
                break;
              case ApplicationCommandTypes.MESSAGE:
                InteractionType = MessageContextMenuCommandInteraction;
                break;
              default:
                console.log('Received unknown type');
                return;
            }
            break;
          case InteractionTypes.MESSAGE_COMPONENT:
            switch (data.data.component_type) {
              case MessageComponentTypes.BUTTON:
                InteractionType = ButtonInteraction;
                break;
              case MessageComponentTypes.SELECT_MENU:
                InteractionType = SelectMenuInteraction;
                break;
              default:
                console.log('Received unknown type');
                return;
            }
            break;
          case InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE:
            InteractionType = AutocompleteInteraction;
            break;
          default:
            console.log('Received unknown type');
            return;
        }
    
        const interaction = new InteractionType(client, data);
        
        
        console.log({
            cwd: process.cwd(),
            ls: fs.readdirSync(process.cwd()),


        })
                try {
                    if (interaction.isCommand() && commands[interaction.commandName]) {
                            const file = './' + path.join('bundle', 'commands', commands[interaction.commandName]._filePath);
                            const fileData = await import(file);
                            let command = fileData.default;
                            let output = command.execute(new InteractionResponse(interaction));
                            if (output instanceof Promise) output = await output;
                    } else if (interaction.customId?.startsWith?.('!')) {
                        const [name, params] = JSON.parse(interaction.customId.substring(1));
                        await (new InteractionResponse(interaction)).reply('ACK! ' + name + ' ' + params);
                    } else {
                        await interaction.reply({ embeds: [
                            new MessageEmbed()
                                .setColor('#ff4444')
                                .setTitle('Command Error')
                                .setDescription('```' + `Conflict Erorr: CommandNotFound` + '```')
                                .setTimestamp()
                        ] });
                    }
                } catch (err) {

                    console.error(err, 'initialCatchError');
                    try {
                        // if (errorHandler && false) return errorHandler(err, interaction);
                        const file = getFile(err);
                        await interaction.reply({ embeds: [
                            new MessageEmbed()
                                .setColor('#ff4444')
                                .setTitle('Command Error')
                                .setDescription(file + ' ```' + cleanLines(err.stack, 4) + '```')
                                .setTimestamp()
                        ] });
                    } catch (nestedErr) {
                        
                        console.error('Conflict had a hard time figuring this one out.', nestedErr);
                        // if (errorHandler && false) return errorHandler(err, interaction);
                        try {
                            await interaction.channel.send(
                                new MessageEmbed()
                                    .setColor('#ff4444')
                                    .setTitle('Command Error')
                                    .setDescription('```' + err.stack + '```')
                                    .setTimestamp()
                            );
                        } catch (nestedNestedErr) {
                            console.error('Nested error handling failed.');
                        }
                    }
                }
        }
}

function generateClient (token) {
    const previousValue = process.env.DISCORD_TOKEN === undefined ? undefined : process.env.DISCORD_TOKEN;
    process.env.DISCORD_TOKEN = token;
    const client = new Discord.Client({ intents: [] });
    process.env.DISCORD_TOKEN = previousValue;
    return client;
}