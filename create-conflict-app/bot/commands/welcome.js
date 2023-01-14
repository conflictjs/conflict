import Command from '@conflict/beta/commands';
import welcome from '../views/welcome.js';

export default new Command({
    name: 'welcome',
    description: 'Display the Welcome view',
    options: [],
    execute: async (command, options, utils) => {
        command.respond(welcome());
    }
});