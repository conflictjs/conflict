// Compile .conflict/build to public/api/index.js for Vercel deployment

import stump from './logger.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { dirname } from "esm-dirname";
import Discord from 'discord.js';
import { REST } from '@discordjs/rest';
import typesv9 from 'discord-api-types/v9';
import Command from './commands.js';
import View from './view.js';
const { Routes } = typesv9;
const __dirname = dirname(import.meta);

global.__ConflictFilePrefix = process.platform === 'win32' ? 'file://' : '';
global.__ConflictViewParser = View.createElement;
const selfVersion = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;

if (fs.existsSync(path.join(process.cwd(), '.vercel'))) {
    fs.rmSync(path.join(process.cwd(), '.vercel'), { recursive: true, force: true });
    // Remove public folder if it exists
}

let rest;
if (process.env.TOKEN) rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

fs.mkdirSync(path.join(process.cwd(), '.vercel'));
fs.mkdirSync(path.join(process.cwd(), '.vercel', 'output'));
fs.writeFileSync(path.join(process.cwd(), '.vercel', 'output', 'config.json'), fs.readFileSync(path.join(__dirname, 'vercel-kit', 'config.json'), 'utf8'), 'utf8');

fs.mkdirSync(path.join(process.cwd(), '.vercel', 'output', 'static'));
fs.writeFileSync(path.join(process.cwd(), '.vercel', 'output', 'static', 'index.html'), fs.readFileSync(path.join(__dirname, 'vercel-kit', 'index.html'), 'utf8'), 'utf8');

fs.mkdirSync(path.join(process.cwd(), '.vercel', 'output', 'functions'));
fs.mkdirSync(path.join(process.cwd(), '.vercel', 'output', 'functions', 'discord.func'));
fs.writeFileSync(path.join(process.cwd(), '.vercel', 'output', 'functions', 'discord.func', '.vc-config.json'), fs.readFileSync(path.join(__dirname, 'vercel-kit', '.vc-config.json'), 'utf8'), 'utf8');
fs.writeFileSync(path.join(process.cwd(), '.vercel', 'output', 'functions', 'discord.func', 'serve.js'), fs.readFileSync(path.join(__dirname, 'vercel-kit', 'serve.js'), 'utf8'), 'utf8');
fs.writeFileSync(path.join(process.cwd(), '.vercel', 'output', 'functions', 'discord.func', 'dispatch.js'), fs.readFileSync(path.join(__dirname, 'vercel-kit', 'dispatch.js'), 'utf8'), 'utf8');
fs.writeFileSync(path.join(process.cwd(), '.vercel', 'output', 'functions', 'discord.func', 'package.json'), fs.readFileSync(path.join(__dirname, 'vercel-kit', 'package.json'), 'utf8'), 'utf8');

stump.info('Generated core files');

export const finish = () => {
    return new Promise((resolve, reject) => {
        stump.info('Installing modules to function runtime');

        exec('cp -r ./node_modules ./.vercel/output/functions/discord.func/node_modules && cp -r ./.conflict/build ./.vercel/output/functions/discord.func/bundle && npm i @conflict/beta@' + selfVersion, { cwd: process.cwd() }, async (error, stdout, stderr) => {
            if (error) return stump.error(error);
            stump.info('Installed modules');

            let commands = {};

            let commandsPath = path.join(process.cwd(), '.vercel', 'output', 'functions', 'discord.func', 'bundle', 'commands');

            if (fs.existsSync(commandsPath)) {
                let files = fs.readdirSync(commandsPath);
                let filePaths = files.map(file => path.join(commandsPath, file));
                let i = 0;
                for (const file of filePaths) {
                    const fileName = files[i];
                    if (file.endsWith('.js') || file.endsWith('.cjs') || file.endsWith('.mjs')) {
                        let fileData = await import(global.__ConflictFilePrefix + file + '?r=' + Math.random().toString(36).substring(3));
                        if (fileData.default && fileData.default.constructor.name === 'Command') {
                            let command = fileData.default;
                            command._filePath = fileName;
                            commands[command.name] = command;
                        }
                    }
                    i++;

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

            fs.writeFileSync(path.join(process.cwd(), '.vercel', 'output', 'functions', 'discord.func', 'commands.json'), JSON.stringify({ guildCommands, publicCommands, all: commands }, null, 4), 'utf8');

            if (process.env.TOKEN && process.env.APPLICATION_ID) {
                stump.info('Registering commands to Discord');

                for (const guild in guildCommands) {
                    const commandsForGuild = guildCommands[guild];
                    await rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, guild), { body: commandsForGuild })
                }

                await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: publicCommands });

                stump.info(fs.readdirSync(process.cwd()));
            } else stump.warn('Did not register commands to Discord');

            stump.success('Finished build process');

            resolve();
        });        
    })
}