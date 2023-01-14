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


export function getFile (error) {
    let output = 'Unable to find file location';
    try {
        let fileLine = error.stack.split('\n')[1];
        let stackTrace = (fileLine.includes('(') && fileLine.includes(')')) ? fileLine.split('(')[1].split(')')[0] : fileLine.substring(fileLine.indexOf('at') + 3);
        let lastColon = stackTrace.lastIndexOf(':');
        let col = stackTrace.substring(lastColon + 1);
        let filePath = stackTrace.substring(0, lastColon);
        lastColon = filePath.lastIndexOf(':');
        let line = +filePath.substring(lastColon + 1);
        filePath = filePath.substring(0, lastColon);
        if (filePath.startsWith('file://')) filePath = filePath.substring(7);
        const fileData = fs.readFileSync(filePath, 'utf8');
        let snippet = fileData.split('\n').slice(line - 4, line + 2).join('\n');
        let lines = snippet.split('\n');
        if (lines.length < 5) {
            snippet = snippet;
        } else {
            lines = [
                '// ' + path.basename(filePath) + ':' + (line - 3),
                lines[0],
                lines[1],
                lines[2],
                lines[3],
                '//' + ' '.repeat(col - 3) + '^ ' + error.stack.split('\n')[0] + ' (:' + line + ':' + col + ')',
                lines[4],
                lines[5],
                lines[6]
            ];
            snippet = lines.join('\n');
        }
        output = "```js\n" + snippet + "```";
    } catch (err) {}
    return output;
}

export function cleanLines (input, lines) {
    return input.split('\n').splice(0, input.split('\n').length - lines).join('\n');
}


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
                
        let config;
        try {
            config = await import(process.cwd() + '/conflict.config.js');
        } catch (err) {
            return console.error('Missing conflict.config.js');
        }
        let { token, intents, errorHandler, plugins } = config.default;
        
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
                        if (errorHandler) return errorHandler(err, interaction);
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
                        if (errorHandler) return errorHandler(err, interaction);
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