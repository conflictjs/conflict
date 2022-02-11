#!/usr/bin/env node

import { ShardingManager } from 'discord.js'
import { dirname } from "esm-dirname"
import path from 'path'
import { exec } from 'child_process'
const __dirname = dirname(import.meta);
import stump from './logger.js'
import { detectFlag } from './utils.js'

process.argv.shift();
process.argv.shift();

global.__ConflictENV = {};

(async () => {
    if (process.argv[0] == 'dev') {
        await import(__dirname + '/devserver/index.js');
    } else if (process.argv[0] == 'build') {
        stump.info('Starting build...');
        exec('npx babel bot --out-dir .conflict/build', { cwd: process.cwd() }, (error, stdout, stderr) => {
            if (error) return stump.error(error);
            stdout.trim().split('\n').filter(line => line).forEach(line => stump.info(line));
            stderr = stderr.trim().split('\n').filter(line => line);
            stderr.forEach(line => stump.warn(line));
            stump.info(`Build completed with ${stderr.length} errors`);
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
        const { token } = config.default;

        const manager = new ShardingManager(path.join(__dirname, 'bot.js'), { token: token });

        manager.on('shardCreate', shard => stump.success(`Launched shard ${shard.id}`));
        manager.spawn();
    }

})();