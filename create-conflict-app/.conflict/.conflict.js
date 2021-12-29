import babelParser from '@babel/parser'
import plugin from '@babel/plugin-transform-react-jsx'
import Discord, { Client, Intents, Message } from 'discord.js'
import { dirname } from "esm-dirname"
import fs from 'fs'
import Stump from 'stump.js'
import HelloWorld from './views/helloworld.js'
import Counter from './views/counter.js'
import { token } from '../config.DO_NOT_COMMIT.js'

const __dirname = dirname(import.meta);
const client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_WEBHOOKS, Intents.FLAGS.GUILD_INVITES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGE_TYPING ] });
const stump = new Stump(['Debug', 'Timestamp']);

client.on('ready', () => {
    stump.success('Logged in as ' + client.user.tag);
});

let count = 0;

client.on('messageCreate', message => {
    if (message.bot) return;
    console.log(HelloWorld);
    if (message.content.startsWith('!demo')) message.channel.send(HelloWorld);
    if (message.content.startsWith('!count')) {
        count++;
        const countObject = Counter(count);
        console.log('comps', countObject.components)
        message.channel.send(Counter(count));
    }
});

client.login(token);