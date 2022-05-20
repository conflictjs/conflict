// dispatch.js
// Handles Discord interaction only; a complete level of abstraction above the server.

const {
    InteractionResponseType,
    InteractionType,
    verifyKey,
} = require("discord-interactions");

function status (...args) {
    if (args.length === 0) return { ___status: true, status: 200, payload: args[0] };
    const code = 200, payload = {};

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
        return status(200, {
            type: 4,
            data: {
                content: "Hello! You can debug the following data:\n\n```json\n" + JSON.stringify(message, null, 4).substring(0, 1900) + "\n```",
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