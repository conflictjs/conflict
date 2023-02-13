import { uuid, queryString } from './utils.js'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

class StateManager {
    constructor (type) {
        this.type = type;
        this.items = {};
    }
    select (item) {
        if (this.items[item]) return this.items[item];
        this.items[item] = new State(item, this.type);
        return this.items[item];
    }
    drop (item) {
        if (this.items[item]) delete this.items[item];
    }
}
class ComponentManager extends StateManager {
    constructor (type) {
        super(type);
    }
    select (item) {
        if (this.items[item]) return this.items[item];
        this.items[item] = new ComponentState(item, this.type);
        return this.items[item];
    }
}
class State {
    constructor (name, type) {
        this.name = name;
        this.type = type;
        this.data = {};
    }
    static command (commandName) {
        return managers.command.select(commandName);
    }
    static guild (guildId) {
        return managers.guild.select(guildId);
    }
    static user (userId) {
        return managers.user.select(userId);
    }
    static kv () {
        return managers.kv.select('*');
    }
    static components () {
        return managers.components.select('*');
    }
    drop () {
        managers[this.type].drop(this.name);
    }
    get (key) {
        return this.data[key];
    }
    set (key, value) {
        this.data[key] = value;
    }
    delete (key) {
        if (this.data[key]) delete this.data[key];
    }
}
class ComponentState extends State {
    constructor (name, type) {
        super(name, type);
        this.statelessPath = global.__ConflictEnvironment == 'vercel' ? path.join(process.cwd(), '.stateless.cache') : path.join(process.cwd(), '.conflict', '.stateless.cache');
    }
    store (code) {
        let id = uuid();
        let queryString = 'c?type=code&id=' + encodeURIComponent(id);
        this.set(id, code);
        return queryString;
    }
    statelessStore (code) {
        let id = crypto.createHmac("sha256", 'shhh').update(code.toString()).digest("base64");
        let queryString = 'c?type=stateless&r=' + Math.floor(Math.random() * 10000) + (Date.now() + '').substring(5) + '&id=' + encodeURIComponent(id);
        if (this.get(id)) return queryString;
        this.set(id, code);
        let cwd = process.cwd();
        let cache = fs.readFileSync(this.statelessPath, 'utf8');
        cache = cache.split('\n\n[===]\n\n').filter(segment => segment);
        let data = id + '\n' + Buffer.from(code.toString()).toString('base64');
        if (cache.includes(data)) return queryString;
        cache.push(data);
        fs.writeFileSync(this.statelessPath, cache.join('\n\n[===]\n\n'), 'utf8')
        return queryString;
    }
    statelessLoad () {
			let cwd = process.cwd();
			if (!fs.existsSync(this.statelessPath))
				fs.writeFileSync(
					path.join(cwd, ".conflict", ".stateless.cache"),
					"",
					"utf8"
				);
			let cache = fs.readFileSync(this.statelessPath, "utf8");
			cache = cache
				.split("\n\n[===]\n\n")
				.filter((segment) => segment)
				.map((cacheSegment) => {
					let [id, code] = cacheSegment.split("\n");
					code = Buffer.from(code, "base64").toString("utf8");
					return { id, code };
				});
			// for (const segment of cache) {
			//     this.set(segment.id, eval(segment.code));
			// }
			return cache;
		}
    fetch (url) {
        let id = decodeURIComponent(queryString('https://conflict.local/' + url, 'id'));
        return this.get(id);
    }
}

const managers = {
    command: new StateManager('command'),
    guild: new StateManager('guild'),
    user: new StateManager('user'),
    kv: new StateManager('kv'),
    components: new ComponentManager('components'),
};

export { State as default, State, managers }