// dispatch.js
// Handles Discord interaction only; a complete level of abstraction above the server.

const {
    InteractionResponseType,
    InteractionType,
    verifyKey,
} = require("discord-interactions");
const {
    AutocompleteInteraction,
    ButtonInteraction,
    CommandInteraction,
    ButtonInteraction,
    Constants
 } = require("discord.js");
 const { Events, InteractionTypes, MessageComponentTypes, ApplicationCommandTypes } = Constants;

const commands = require('./commands.json');

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

module.exports.dispatch = async (message) => {
    if (message.type === InteractionType.APPLICATION_COMMAND) {
        const data = message;

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
    
        await interaction.reply('Success.\n\n`CODE: 200.1`');

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