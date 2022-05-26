// dispatch.js
// Handles Discord interaction only; a complete level of abstraction above the server.

import DiscordInteractions from 'discord-interactions';
const {
    InteractionResponseType,
    InteractionType,
    verifyKey,
} = DiscordInteractions;

import path from 'path';

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
    if (message.type === InteractionType.APPLICATION_COMMAND) {
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
    
        if (interaction.isCommand()) {
            console.log({ commands, name: interaction.commandName });
            if (commands[interaction.commandName]) {
                const file = './' + path.join( 'bundle', 'commands', commands[interaction.commandName]._filePath);
                const fileData = await import(file);
                let command = fileData.default;
                try {
                    let output = await command.execute(new InteractionResponse(interaction));
                    if (output instanceof Promise) output = await output;
                } catch (err) {

                    stump.error(err);
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
                        
                        stump.error('Conflict had a hard time figuring this one out.', nestedErr);
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
                            stump.error('Nested error handling failed.');
                        }
                    }
                }
            } else {
                await interaction.reply({ embeds: [
                    new MessageEmbed()
                        .setColor('#ff4444')
                        .setTitle('Command Error')
                        .setDescription('```' + `Conflict Erorr: CommandNotFound` + '```')
                        .setTimestamp()
                ] });
            }
        }

        return status(200, {
            type: 4,
            data: {
                content: "Hello! You can debug the following data:\n\n```json\n" + JSON.stringify({ message, commands }, null, 4).substring(0, 1900) + "\n```",
            },
        });
    } else {
        return status(200, {
            type: 4,
            data: {
                content: `Hello! Not a command`,
            },
        })
    }
}

function generateClient (token) {
    const previousValue = process.env.DISCORD_TOKEN === undefined ? undefined : process.env.DISCORD_TOKEN;
    process.env.DISCORD_TOKEN = token;
    const client = new Discord.Client({ intents: [] });
    process.env.DISCORD_TOKEN = previousValue;
    return client;
}