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
    children.forEach((child, index) => {
        let childObject;
        if (child.children && child.children instanceof Array && child.children.filter(newChild => typeof newChild === 'string' || typeof newChild === 'number').length == child.children.length) {
            childObject = child.children.join('');
        }
        else childObject = parseView(child);
        if (child.props && child.props.as && typeof child.props.as === 'function') {
            childObject = new(child.props.as)(childObject);
            delete child.props.as;
        }

        if (child.tag.endsWith('_arr')) child.tag = child.tag.substring(0, child.tag.length - 4) + ('$' + Date.now() + index + 'R' + '$'); // Allow for multiple elements with the same tag, so long as it ends with _arr

        // if (!object[child.tag] && child.tag === 'embeds') object[child.tag] = [];
        if (!object[child.tag] && child.tag === 'components') object[child.tag] = [];

        else if (!object[child.tag] && child.tag === 'vstack') object[child.tag] = [];

        if (object[child.tag] && !(object[child.tag] instanceof Array)) object[child.tag] = [object[child.tag]];
        
        if (object[child.tag] instanceof Array) object[child.tag].push(childObject);
        else object[child.tag] = childObject;
    });


    let keys = Object.keys(object);
    // if (keys.length == 1 && keys[0] === 'embed' && tag === 'embeds') object = object[keys[0]];
    if (keys.length == 1 && keys[0] === 'hstack' && tag === 'vstack') object = object[keys[0]];
    //console.log('isComponent', keys.length == 1 && keys[0] === 'component' && tag === 'components');
//    if (keys.length == 1 && keys[0] === 'component' && tag === 'components') object = [object[keys[0]]];
    if (object.components && object.components[0]) {
        //console.log(object.components[0])
    }
    return object;
}

export function recursiveArray (tree) {
    console.log('[recursiveArray]', tree);
    for (const key in tree) {
        console.log(key, key.includes('$'));
        let newName;
        if (key.includes('$')) {
            newName = key.substring(0, key.indexOf('$'));
            if (tree[newName]) tree[newName].push(Object.values(tree[key])[0]);
            else {
                console.log('[value]', (tree[key]));
                console.log('[values]', Object.values(tree[key]));
                tree[newName] = [Object.values(tree[key])[0]];
            }
            delete tree[key];
        }
        if (tree[key] instanceof Array) {
            console.log('[typeArray]', tree[key]);
            tree[key] = tree[key].map(item => recursiveArray(item));
        } else if (newName && tree[newName] instanceof Array) {
            console.log('[typeArray]', tree[newName]);
            tree[newName] = tree[newName].map(item => recursiveArray(item));
        } else if (typeof tree[key] == 'object') tree[key] = recursiveArray(tree[key]);
    }
    return tree;
}

export function parseTree (tree) {
    /**
     * Parses a tree of elements to deal with syntax
     * @param {object} A tree of JSX elements
     * @returns {object} A parsed message ready to be sent
     */
    tree = recursiveArray(tree);
    console.log(JSON.stringify(tree, null, 4));
    return tree;
}

export class View {
    constructor (target) {
        let parsed = parseView(target);
        parsed = parseTree(parsed);
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