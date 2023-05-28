import { attempt, detectFlag, file } from "../utils.js";
import fs from "fs";

class Environment {
    #argv;
    #env;
    #cwd;

    constructor (argv, env, cwd) {
        this.#argv = argv;
        this.#env = env;
        this.#cwd = cwd;
    }

    get verbose () {
        return detectFlag(this.#argv, 'verbose') || detectFlag(this.#argv, 'detailed');
    }

    get cwd () {
        return this.#cwd;
    }

    get vercel () {
        this.#env.VERCEL_ENV || this.#argv.includes('-vercel') || this.#argv.includes('--vercel') || this.#argv.includes('-V') || this.#argv.includes('--V');
    }

    get configFilePath () {
        return file(this.#cwd + '/conflict.config.js');
    }

    get tokenFilePath () {
        return file(this.#cwd + '/.token');
    }

    async getConfig () {
        return await import(this.configFilePath);
    }

    async getToken () {
        const config = await this.getConfig();
        return config.default.token ?? this.#env.TOKEN ?? this.#env.token ?? attempt(fs.readFileSync, this.tokenFilePath, 'utf8')[0]?.trim?.() ?? null;
    }

    error () {
        return process.exit(1);
    }
}

export const environment = new Environment(process.argv, process.env);
export default environment;