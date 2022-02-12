import View from './view.js'

export default class Command {
    constructor ({ name, description, options, execute, meta, testing }) {
        this.name = name;
        this.description = description;
        this.options = options;
        this.testing = testing;
        this.type = (testing && testing.guildId) ? 'guild' : 'global';
        this.meta = meta;
        this.executeFn = execute;
    }
    execute (command, options, utils) {
        return this.executeFn(command, options, utils);
    }
}

export class InteractionResponse {
    constructor (interaction) {
        this.interaction = interaction;
        if (interaction.options) {
            let optionsArray = interaction.options.data;
            let options = {};
            let rawOptions = {};

            for (const option of optionsArray) {
                options[option.name] = option.value;
                rawOptions[option.name] = option;
            }

            this.options = options;
            this.rawOptions = rawOptions;
        
        }
        this.user = interaction.user;
        this.id = interaction.id;
        this.guild = interaction.guild;
        this.member = interaction.member;
        this.author = interaction.member.user;
        this.token = interaction.token;
        this.type = interaction.type;

        this.commandName = interaction.commandName;
        this.channel = interaction.channel;
        this.client = interaction.client;
        this.createdAt = interaction.createdAt;
        this.createdTimestamp = interaction.createdTimestamp;
        
    }
    
    deferReply () {
        return this.interaction.deferReply();
    }
    editReply (...options) {
        return this.interaction.reditReply(...options);
    }
    deleteReply () {
        return this.interaction.deleteReply();
    }
    fetchReply () {
        return this.interaction.fetchReply();
    }
    followUp (...options) {
        return this.interaction.followUp(...options);
    }
    inGuild () {
        return this.interaction.inGuild();
    }
    isCommand () {
        return this.interaction.isCommand();
    }
    isButton () {
        return this.interaction.isButton();
    }
    isContextMenu () {
        return this.interaction.isContextMenu();
    }
    isMessageComponent () {
        return this.interaction.isMessageComponent();
    }
    isSelectMenu () {
        return this.interaction.isSelectMenu();
    }
    reply (...options) {
        return this.interaction.reply(...options);
    }
    respond (...options) {
        return this.interaction.reply(...options);
    }
    getView () {
        return View;
    }
    view (view, options) {
        if (!(view instanceof View)) view = new View(view);
        view.applyTo(this.interaction, options, true);
    }
    privateView (view, options) {
        view.ephemeral = true;
        this.view(view, options);
    }
    sendView (options) {
        if (!view instanceof View) return;
        console.log(JSON.stringify(view, null, 4));
        return this.interaction.reply(view);
    }
    update (...options) {
        if (this.interaction.update) return this.interaction.update(options);
        return this.reply(...options);
    }
}

export { Command };