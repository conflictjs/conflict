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

if (fs.existsSync(path.join(process.cwd(), 'public'))) {
    fs.rmSync(path.join(process.cwd(), 'public'), { recursive: true, force: true });
    // Remove public folder if it exists
}

let rest;
if (process.env.TOKEN) rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

fs.mkdirSync(path.join(process.cwd(), 'public')); // Create / re-create the public folder

fs.mkdirSync(path.join(process.cwd(), 'public', 'api')); // Create api routes folder
fs.mkdirSync(path.join(process.cwd(), 'public', 'core')); // Create internals folder

fs.writeFileSync(path.join(process.cwd(), 'public', 'api', 'discord.js'), fs.readFileSync(path.join(__dirname, 'vercel-kit', 'api.js'), 'utf8'), 'utf8');
fs.writeFileSync(path.join(process.cwd(), 'public', 'core', 'dispatch.js'), fs.readFileSync(path.join(__dirname, 'vercel-kit', 'dispatch.js'), 'utf8'), 'utf8');
fs.writeFileSync(path.join(process.cwd(), 'public', 'api', 'index.html'), fs.readFileSync(path.join(__dirname, 'vercel-kit', 'index.html'), 'utf8'), 'utf8');

stump.info('Generated core files');

export const finish = () => {
    return new Promise((resolve, reject) => {
        exec('cp -r .conflict/build public/bundle', { cwd: process.cwd() }, async (error, stdout, stderr) => {
            if (error) return stump.error(error);
            stump.info('Bundled bot code');

            if (process.env.TOKEN && process.env.APPLICATION_ID) {
                stump.info('Registering commands to Discord');

                const output = await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), { body: [
                    {
                        name: 'vercel',
                        description: 'Test Conflict with Vercel'
                    }
                ] });

                stump.info(output);
            }

            stump.success('Finished build process');

            resolve();
        });        
    })
}