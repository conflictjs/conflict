import { REST } from '@discordjs/rest';
import deepEqual from 'deep-equal';
import types from 'discord-api-types/v9';
const { Routes } = types;

export default class CommandManager {
    constructor (client, stump) {
        this.client = client;
        this.rest = new REST({ version: '9' }).setToken(client.token);
        this.userId = client.user.id;

        this.stump = stump;
    }

    #commandTransform (command) {
        return [command.name, {
            name: command.name,
            description: command.description,
            options: command.options,
            nsfw: command.nsfw,
            dm_permission: command.dm_permission,
            type: command.type
        }];
    }

    async setGlobalCommands (commands) {
        const apiCommands = await this.rest.get(Routes.applicationCommands(this.userId));

        const apiCommandNames = apiCommands.map(command => command.name);
        const commandNames = commands.map(command => command.name);

        const diffAdd = commands.filter(command => !apiCommandNames.includes(command.name));
        const diffRemove = apiCommands.filter(command => !commandNames.includes(command.name));
        const diffModify = [];

        const existingLocal = Object.fromEntries(commands.filter(command => apiCommandNames.includes(command.name)).map(this.#commandTransform));
        const existingApi = Object.fromEntries(commands.filter(command => commandNames.includes(command.name)).map(this.#commandTransform));

        for (const command in existingLocal) {
            if (!deepEqual(existingLocal[command], existingApi[command])) {
                diffModify.push(command);
            }
        }

        this.stump.verbose(`Adding`, diffAdd.length, `global commands, removing`, diffRemove.length, `global commands, and modifying`, diffModify.length, `global commands`);

        for (const command of diffAdd) {
            await this.rest.post(Routes.applicationCommands(this.userId), { body: command });
            this.stump.verbose(`Added global command ${command.name}`);
        }

        for (const command of diffRemove) {
            await this.rest.delete(Routes.applicationCommand(this.userId, command.id));
            this.stump.verbose(`Removed global command ${command.name}`);
        }

        for (const command of diffModify) {
            await this.rest.patch(Routes.applicationCommand(this.userId, command.id), { body: command });
            this.stump.verbose(`Modified global command ${command.name}`);
        }

        return {
            added: diffAdd,
            removed: diffRemove,
            modified: diffModify
        }
    }
}