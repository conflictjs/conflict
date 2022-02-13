import View, { Component } from './view.js'

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
        if (interaction.member) this.author = interaction.member.user;
        this.token = interaction.token;
        this.type = interaction.type;

        this.commandName = interaction.commandName;
        this.channel = interaction.channel;
        this.client = interaction.client;
        this.createdAt = interaction.createdAt;
        this.createdTimestamp = interaction.createdTimestamp;

        this.values = interaction.values;
        
        if (interaction.isModalSubmit) {
            let values = {};
            interaction.components.map(component => component.components[0]).forEach(component => {
                values[component.custom_id] = component.value;
            });
            this.values = values;
        }
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
        let ephemeral = false;
        if (options[1] && options[1].ephemeral) ephemeral = true;
        if (options[0] instanceof View && ephemeral) return this.privateView(...options);
        if (options[0] instanceof Component && ephemeral) return this.privateView(...options);
        if (options[0] instanceof View) return this.view(...options);
        if (options[0] instanceof Component) return this.view(...options);
        if (ephemeral && options[0] instanceof String) options[0] = { content: options[0], ephemeral: true };
        if (ephemeral && options[0] && options[0].toString() == '[object Object]') options[0].ephemeral = true;
        return this.interaction.reply(...options);
    }
    respond (...options) {
        return this.reply(...options);
    }
    respondPrivate (...options) {
        return this.privateReply(...options);
    }
    replyPrivate (...options) {
        return this.privateReply(...options);
    }
    private (...options) {
        return this.privateReply(...options);
    }
    privateReply (...options) {
        if (options[0] instanceof String) options[0] = { content: options[0], ephemeral: true };
        if (options[0] && options[0].toString() == '[object Object]') options[0].ephemeral = true;
        return this.reply(...options);
    }
    getView () {
        return View;
    }
    modal (view) {
        if (!(view instanceof View)) view = new View(view);
        if (!view.title) throw new Error('Missing title');
        if (!view.custom_id) throw new Error('Missing callback');
        if (!view.title) throw new Error('Missing title');
        if (!view.components) throw new Error('Missing components');
        return this.interaction.client.api.interactions(this.interaction.id, this.interaction.token).callback.post({ data: {
            type: 9,
            data: view 
        }});
    }
    view (view, options) {
        if (!(view instanceof View)) view = new View(view);
        view.applyTo(this.interaction, options, true);
    }
    privateView (view, options) {
        view.ephemeral = true;
        this.view(view, options);
    }
    update (...options) {
        if (this.interaction.update) return this.interaction.update(options);
        return this.reply(...options);
    }
}

export { Command };