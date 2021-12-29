import { ShardingManager } from 'discord.js'
import config from '../conflict.config.js'
import { dirname } from "esm-dirname"
import path from 'path'
const __dirname = dirname(import.meta);
import stump from './logger.js'
const { token } = config;

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), { token: token });

manager.on('shardCreate', shard => stump.success(`Launched shard ${shard.id}`));

manager.spawn();
