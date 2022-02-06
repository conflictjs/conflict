import Discord from 'discord.js';
import stump from './logger.js';

export const createElement = (tag, props = {}, ...children) => {
    if (props == null) props = {};
    if (children == null) children = [];
    
    if (typeof tag === 'function') {
        props.children = children;
        return tag(props);
    }

    return {
        tag: tag,
        props: props,
        children: children
    }

}

export const parseView = (input) => {
    let { tag, props = {}, children = [] } = input;
    if (props == null) props = {};
    if (children == null) children = [];
    if (children.length == 1 && children[0] instanceof Array) children = children[0];
    if (children.length == 1 && children[0] instanceof Array) children = children[0];
    let object = props;
    children.forEach(child => {
        let childObject;
        if (child.children && child.children instanceof Array && child.children.filter(newChild => typeof newChild === 'string' || typeof newChild === 'number').length == child.children.length) {
            childObject = child.children.join('');
        }
        else childObject = parseView(child);
        if (child.props && child.props.as && typeof child.props.as === 'function') {
            childObject = new(child.props.as)(childObject);
            delete child.props.as;
        }

        if (!object[child.tag] && child.tag === 'embeds') object[child.tag] = [];
        if (object[child.tag] && !(object[child.tag] instanceof Array)) object[child.tag] = [object[child.tag]];
        
        if (object[child.tag] instanceof Array) object[child.tag].push(childObject);
        else object[child.tag] = childObject;
    });


    let keys = Object.keys(object);
    if (keys.length == 1 && keys[0] === 'embed' && tag === 'embeds') object = object[keys[0]];
    //console.log('isComponent', keys.length == 1 && keys[0] === 'component' && tag === 'components');
    if (keys.length == 1 && keys[0] === 'component' && tag === 'components') object = [object[keys[0]]];
    //console.log(object);
    if (object.components && object.components[0]) {
        //console.log(object.components[0])
    }
    return object;
}

export class View {
    constructor (target) {
        let parsed = parseView(target);
        let $hooks = [];
        for (const key in parsed) {
            this[key] = parsed[key];
        }
        this.callback = async function (message) {
            if (message instanceof Discord.Message) {
                let hooks = $hooks;
                for (const hook of hooks) {
                    hook(output, this);
                }
            }
        }
        this.applyTo = async function (channel) {
            let output = channel.send(this);
            if (output instanceof Promise) output = await output;
            console.log(output, output instanceof Discord.Message);
            if (output instanceof Discord.Message) {
                let hooks = $hooks;
                for (const hook of hooks) {
                    hook(output, this)
                }
            }
        }
        this.applyHooks = function (...hooks) {
            $hooks.push(...hooks);
            return this;
        }
        this.useHooks = function (...hooks) {
            $hooks.push(...hooks);
            return this;
        }
    }
    static createElement (tag, props = {}, ...children) {
        return createElement(tag, props, ...children);
    }
    toObject () {
        let object = {};
        for (const key in this) {
            object[key] = this[key];
        }
        return object;
    }
}

export default View;