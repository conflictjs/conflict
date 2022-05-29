import stump from './logger.js';
import { dirname } from "esm-dirname"
const __dirname = dirname(import.meta);

stump.info("Running Conflict on Replit...");

await import(global.__ConflictFilePrefix + __dirname + '/devserver/index.js');