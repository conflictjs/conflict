import stump from './logger.js';
import { dirname } from "esm-dirname"
const __dirname = dirname(import.meta);

stump.info("Running Conflict on Replit...");

await import(__dirname + '/devserver/index.js');