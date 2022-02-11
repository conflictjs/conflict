import { uuid, queryString } from './utils.js'
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
    }
    store (code) {
        let id = uuid();
        let queryString = 'c?type=code&id=' + encodeURIComponent(id);
        this.set(id, code);
        return queryString;
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