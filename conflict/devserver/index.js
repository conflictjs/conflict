import { ShardingManager } from 'discord.js';
import { exec } from 'child_process';
import stump from '../logger.js';
import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';
import { dirname } from "esm-dirname";
import { detectFlag } from '../utils.js';
const __dirname = dirname(import.meta);
const build = () => {
	return new Promise((resolve, reject) => {
		exec(
			"swc bot --out-dir .conflict/build --config-file " +
				path.join(__dirname, "..", ".swcrc"),
			{ cwd: process.cwd() },
			(error, stdout, stderr) => {
				if (error) return reject(error);
				resolve({ stdout, stderr });
			}
		);
	});
};

let running = false;
let next;

build().then(async ({ stdout, stderr }) => {
	stump.info('Starting development environment...');

	global.__ConflictENV = {};

	global.__ConflictENV.verbose = detectFlag(process.argv, 'verbose') || detectFlag(process.argv, 'detailed');
	if (global.__ConflictENV.verbose) stump.verbose('Running verbose');
	if (global.__ConflictENV.verbose) process.env.CONFLICT_VERBOSE = "TRUE";
	let config;
	try {
		config = await import(process.cwd() + '/conflict.config.js');
	} catch (err) {
		stump.error('Missing conflict.config.js');
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

	const manager = new ShardingManager(path.join(__dirname, '..', 'bot.js'), { token: token });

	manager.on('shardCreate', shard => stump.success(`Launched shard ${shard.id}`));
	manager.spawn().then(_ => {
		stump.success('All shards launched, waiting for file events...');
		chokidar.watch('./bot', {
			persistent: true,
			ignoreInitial: true,
			awaitWriteFinish: true
		}).on('all', (event, path) => {
			onFileChange();
		});		
	});

	function refresh () {
		manager.broadcastEval(c => {
			c.emit('conflict.hotReload');
		});
	}

	async function buildAndRefresh () {
		manager.broadcastEval(c => {
			c.emit('conflict.startThinking');
		});
		stump.info('Change detected, rebuilding...');
		if (global.__ConflictENV.verbose) stump.verbose('Starting rebuild...');
		await build();
		if (global.__ConflictENV.verbose) stump.verbose('Finished building, starting refresh...');
		refresh();
		if (global.__ConflictENV.verbose) stump.verbose('Refresh finished');
	}

	async function onFileChange () {
		if (running) next = true;
		else {
			running = true;
			await buildAndRefresh();
			running = false;
			while (next) {
				next = false;
				buildAndRefresh();
			}
		}
	}

});