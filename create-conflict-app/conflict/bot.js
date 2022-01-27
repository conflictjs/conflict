import babelParser from '@babel/parser'
import plugin from '@babel/plugin-transform-react-jsx'
import Discord, { Client, Intents, Message } from 'discord.js'
import { dirname } from "esm-dirname"
import path from 'path'
import fs from 'fs'
import stump from './logger.js'
import config from '../conflict.config.js'
import { _setClient } from './events.js'
const { token, intents } = config;
const __dirname = dirname(import.meta);
const client = new Client({ intents: (intents || ["GUILD_MESSAGES"]).map(intent => Intents.FLAGS[intent] ) });

_setClient(client);

client.on('ready', () => {
    stump.success('Logged in as ' + client.user.tag);
});

client.login(token);

async function initEvents () {
    let eventsPath = path.join(__dirname, '..', '.conflict', 'events');
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
    let commandsPath = path.join(__dirname, '..', '.conflict', 'commands');
    if (fs.existsSync(commandsPath)) {
        let files = fs.readdirSync(commandsPath);
        let filePaths = files.map(file => path.join(commandsPath, file));
        for (const file of filePaths) {
            if (file.endsWith('.js') || file.endsWith('.cjs') || file.endsWith('.mjs')) {
                let fileData = await import(file);

                if (fileData.default && fileData instanceof Command) {
                    let command = fileData.default;
                    commands[command.name] = command;
                }
            }
        }
    }
    console.log('Commands', commands);
}

async function init () {
    await initEvents();
    await initCommands();
}

init();