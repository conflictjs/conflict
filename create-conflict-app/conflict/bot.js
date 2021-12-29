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
    let eventsPath = path.join(__dirname, '..', 'bot', 'events');
    if (fs.existsSync(eventsPath)) {
        let files = fs.readdirSync(eventsPath);
        let filePaths = files.map(file => path.join(eventsPath, file));
        for (const file of filePaths) {
            if (file.endsWith('.js') || file.endsWith('.cjs') || file.endsWith('.mjs')) await import(file);
        }
    }    
}

initEvents();