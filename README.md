
<p align="center">
<img alt="Conflict logo, in a rounded font with a blue and red background" src="https://conflictframework.repl.co/conflict.svg" width="300">
</p>

# Conflict
The JavaScript framework for Discord bots

> This project is under development and currently will not run.

## Current development state & details

`create-conflict-app` is a folder for the output produced when running the "create-conflict-app" script. It should function similar to create-react-app or create-next-app in how it creates the needed folder structure and installs the library.

`create-conflict-app/bot` is where the code for the bot is stored. It is in a sub-directory so that all files can be transpiled for JSX, therefore allowing for a more organic file structure.

`create-conflict-app/.conflict` is similar to `.next` with Next.js. It holds the output and all temporary files for conflict.

`create-conflict-app/conflict` is the folder for all of Conflict's exports and utilities. Other than `bot.js`, every file will be mapped to the `conflict/<filename>` export.

`create-conflict-app/conflict/bot.js` is the entry point, which will be mapped to the command `conflict start` and `conflict dev` in the NPM package.
