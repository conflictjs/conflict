// Compile .conflict/build to public/api/index.js for Vercel deployment

import stump from './logger.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { dirname } from "esm-dirname";
const __dirname = dirname(import.meta);

if (fs.existsSync(path.join(process.cwd(), 'public'))) {
    fs.rmSync(path.join(process.cwd(), 'public'), { recursive: true, force: true });
    // Remove public folder if it exists
}

fs.mkdirSync(path.join(process.cwd(), 'public')); // Create / re-create the public folder

fs.mkdirSync(path.join(process.cwd(), 'public', 'api')); // Create api routes folder
fs.mkdirSync(path.join(process.cwd(), 'public', 'core')); // Create internals folder

fs.writeFileSync(path.join(process.cwd(), 'public', 'api', 'discord.js'), fs.readFileSync(path.join(__dirname, 'vercel-kit', 'api.js'), 'utf8'), 'utf8');
fs.writeFileSync(path.join(process.cwd(), 'public', 'core', 'dispatch.js'), fs.readFileSync(path.join(__dirname, 'vercel-kit', 'dispatch.js'), 'utf8'), 'utf8');

stump.info('Generated core files');

export const finish = () => {
    return new Promise((resolve, reject) => {
        exec('cp .conflict/build public/bundle', { cwd: process.cwd() }, (error, stdout, stderr) => {
            if (error) return stump.error(error);
            stump.info('Bundled bot code');
            resolve();
        });        
    })
}