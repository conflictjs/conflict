
<p align="center">
<img alt="Conflict logo, in a rounded font with a blue and red background" src="https://conflictframework.repl.co/conflict.svg" width="300">
</p>

# Conflict
The JavaScript UI framework for Discord bots

[![
    Discord badge
](
    https://img.shields.io/discord/921962253262155876?color=%235865f2&label=%20&logo=Discord&logoColor=white
)](
    https://discord.gg/jCgArsS7ub
)
[![
    GitHub badge
](
    https://img.shields.io/github/last-commit/yodalightsabr/conflict?color=%23222&label=%20%20%20&logo=GitHub&logoColor=white
)](
    https://github.com/yodalightsabr/conflict
)

> ## **Status update:** New updates every **`📆 weekend`**
--------
> ### ⚠️ This project is under development and will likely not run as expected. Please do not use in a production environment.
--------
Get started by running `npx create-conflict-app`
--------


## What is Conflict?
Conflict aims to be the best JavaScript framework for making Discord bots. Most frameworks are composed of classes and based on events and functions. Conflict is different. Conflict sets up a directory structure to handle every challenging aspect of making a Discord bot, including command registration, command handling, UI structuring, events, storage, state, and even sharding. Under the hood, it's just Discord.js with superpowers.

## How can I contribute?
It's great you want to contribute! Since I probably have a lot of progress locally and it is still very much under development, so you should join the [Discord server](https://discord.gg/KuAHEnbj5v).
Or, if you find a typo in any of my readmes or docs, please open a PR, because that happens too often. 🤪
Additionally, you can drop a ⭐ **star** on this repo to show your support. If you have any feature suggestions, please open an issue or join the Discord server.

## Current development state & details

`create-conflict-app` is a testing place for the Conflict bot, currently running in the Discord server. Whatever the bot is doing is from the code in here.

`create-conflict-app/bot` is where the code for the bot is stored. It is in a subdirectory so that all files can be transpiled for JSX, therefore allowing for a more organic file structure.

`create-conflict-app/.conflict` is similar to `.next` with Next.js. It holds the output and all temporary files for conflict.

`create-conflict-app/conflict` is the folder for all of Conflict's exports and utilities. Other than `bot.js` and `ep.js`, most files will be mapped to the `@conflict/beta/<filename>` export.

`create-conflict-app/conflict/ep.js` is the entry point, which will are mapped to the command `conflict start` and `conflict dev` in the NPM package.
