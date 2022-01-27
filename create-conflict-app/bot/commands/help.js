import Command from '../../conflict/commands';

export default new Command({
    name: 'help',
    description: 'Get help',
    options: [],
    testing: {
        guildId: ''
    },
    execute: async (command, options, utils) => {
        command.respond("Well, this isn't really helpful.");
    }
});