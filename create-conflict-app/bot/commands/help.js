import Command from 'conflict/command';

export default new Command({
    name: '/help',
    description: 'Get help',
    options: [],
    execute: async (command, options, api) => {
        command.respond("Well, this isn't really helpful.");
    }
});