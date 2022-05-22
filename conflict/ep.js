#!/usr/bin/env node

import { ShardingManager } from 'discord.js'
import { dirname } from "esm-dirname"
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'
const __dirname = dirname(import.meta);
import stump from './logger.js'
import { detectFlag } from './utils.js'

process.argv.shift();
process.argv.shift();

global.__ConflictENV = {};

const vercel = process.env.VERCEL_ENV || process.argv.includes('-vercel') || process.argv.includes('--vercel') || process.argv.includes('-V') || process.argv.includes('--V');

(async () => {
    if (process.argv[0] == 'help' || process.argv.includes('-h') || process.argv.includes('--h') || process.argv.includes('-help') || process.argv.includes('--help')) {
        stump.info('Please view documentation at https://conflict.js.org/docs');
        return;
    }

    if (process.argv[0] == 'dev') {
        await import(__dirname + '/devserver/index.js');
    } else if (process.argv[0] == 'build') {
        stump.info('Starting build...');

        exec('npx babel bot --out-dir .conflict/build --config-file ' + path.join(__dirname, 'babel.config.js'), { cwd: process.cwd() }, async (error, stdout, stderr) => {
            if (error) return stump.error(error);
            stdout.trim().split('\n').filter(line => line).forEach(line => stump.info(line));
            stderr = stderr.trim().split('\n').filter(line => line);
            stderr.forEach(line => stump.warn(line));
            stump.success(`Build completed with ${stderr.length} errors`);

            if (vercel) {
                stump.info('Deploying to Vercel will disable events and only listen for commands');
                const { finish } = await import('./vercel.js');
                if (finish) await finish();
            }
        });
    } else {
        
        global.__ConflictENV.verbose = detectFlag(process.argv, 'verbose') || detectFlag(process.argv, 'detailed');
        if (global.__ConflictENV.verbose) stump.verbose('Running verbose');
        if (global.__ConflictENV.verbose) process.env.CONFLICT_VERBOSE = "TRUE";
        let config;
        try {
            config = await import(process.cwd() + '/conflict.config.js');
        } catch (err) {
            return stump.error('Missing conflict.config.js');
        }
        let { token } = config.default;
        if (!token) token = process.env.TOKEN ?? process.env.token;
        if (!token) {
            try {
                token = fs.readFileSync(process.cwd() + '/token', 'utf8');
            } catch (err) {
                stump.error(new Error('Missing token. No token found in config file, token file, or env variable.'));
                process.exit(1);
            }
        }

        const manager = new ShardingManager(path.join(__dirname, 'bot.js'), { token: token });

        manager.on('shardCreate', shard => stump.success(`Launched shard ${shard.id}`));
        manager.spawn();
    }

})();