// Compile .conflict/build to public/api/index.js for Vercel deployment

import stump from './logger.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { dirname } from "esm-dirname";
import Discord from 'discord.js';
import { REST } from '@discordjs/rest'
import typesv9 from 'discord-api-types/v9'
const { Routes } = typesv9;
const __dirname = dirname(import.meta);

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

stump.info('Generated core files');

export const finish = () => {
    return new Promise((resolve, reject) => {
        exec('cp -r ./node_modules ./.vercel/output/functions/discord.func/node_modules && cp -r ./.conflict/build ./.vercel/output/functions/discord.func/bundle', { cwd: process.cwd() }, async (error, stdout, stderr) => {
            if (error) return stump.error(error);
            stump.info('Installed modules to function runtime');
            stump.info('Bundled bot code');

            if (process.env.TOKEN && process.env.APPLICATION_ID) {
                stump.info('Registering commands to Discord');

                const output = await rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, '921962253262155876'), { body: [
                    {
                        name: 'vercel',
                        description: 'Test Conflict with Vercel (guild)'
                    }
                ] });

                stump.info(fs.readdirSync(process.cwd()));
            }

            stump.success('Finished build process');

            resolve();
        });        
    })
}