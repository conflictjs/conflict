#!/usr/bin/env node

import { ShardingManager } from 'discord.js'
import { dirname } from "esm-dirname"
const __dirname = dirname(import.meta);

import stump from '../logger.js'
import { file } from '../utils.js'
import { build } from '../build/index.js'
import environment from './environment.js'

process.argv.shift();
process.argv.shift();

global.__ConflictENV = {};
global.__ConflictFilePrefix = process.platform === 'win32' ? 'file://' : '';

const { vercel } = environment;

(async () => {
    if (process.argv[0] == 'help' || process.argv.includes('-h') || process.argv.includes('--h') || process.argv.includes('-help') || process.argv.includes('--help')) {
        stump.info('Please view documentation at https://conflict.js.org/docs');

    } else if (process.argv[0] == 'dev') {
        if (global.__ConflictReplitRunDev) delete global.__ConflictReplitRunDev;

        await import(file(__dirname, 'devserver', 'index.js'));

    } else if (process.argv[0] == 'build') {
        stump.info('Starting build...');

        const { info, errors } = await build({ vercel });

        info
            .trim()
            .split("\n")
            .filter((line) => line)
            .forEach((line) => stump.info(line));

        stump.success(`Build completed with ${
            errors
                .trim()
                .split("\n")
                .filter((line) => line)
                .map((line) => (stump.warn(line), line))
                .length
        } errors`);

        if (vercel) stump.info("Deploying to Vercel will disable events and only listen for commands");

    } else {
        if (environment.verbose) stump.verbose('Running verbose');
        let config;

        try {
            config = await environment.getConfig();
        } catch (err) {
            stump.error('Missing conflict.config.js');
            environment.error();
        }

        const { token } = environment;
        if (!token) {
            stump.error(new Error('Missing token. No token found in config file, token file, or env variable.'));
            environment.error();
        }

        const manager = new ShardingManager(file(__dirname, "..", 'bot.js'), { token });

        manager.on('shardCreate', shard => stump.success(`Launched shard ${shard.id}`));
        manager.spawn();
    }
})();