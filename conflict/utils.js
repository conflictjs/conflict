import fs from 'fs';
import path from 'path';

export function uuid () {
    let time = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, character => {
        let random = (time + Math.random() * 16) %16 | 0;
        time = Math.floor(time / 16);
        return (character == 'x' ? random :(random&0x3|0x8)).toString(16);
    });
    return uuid;
}

export function queryString (url, name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    if( results == null )
        return "";
    else
        return results[1];
}

export function getFile (error) {
    let output = 'Unable to find file location';
    try {
        let fileLine = error.stack.split('\n')[1];
        let stackTrace = (fileLine.includes('(') && fileLine.includes(')')) ? fileLine.split('(')[1].split(')')[0] : fileLine.substring(fileLine.indexOf('at') + 3);
        let lastColon = stackTrace.lastIndexOf(':');
        let col = stackTrace.substring(lastColon + 1);
        let filePath = stackTrace.substring(0, lastColon);
        lastColon = filePath.lastIndexOf(':');
        let line = +filePath.substring(lastColon + 1);
        filePath = filePath.substring(0, lastColon);
        if (filePath.startsWith('file://')) filePath = filePath.substring(7);
        const fileData = fs.readFileSync(filePath, 'utf8');
        let snippet = fileData.split('\n').slice(line - 4, line + 2).join('\n');
        let lines = snippet.split('\n');
        if (lines.length < 5) {
            snippet = snippet;
        } else {
            lines = [
                '// ' + path.basename(filePath) + ':' + (line - 3),
                lines[0],
                lines[1],
                lines[2],
                lines[3],
                '//' + ' '.repeat(col - 3) + '^ ' + error.stack.split('\n')[0] + ' (:' + line + ':' + col + ')',
                lines[4],
                lines[5],
                lines[6]
            ];
            snippet = lines.join('\n');
        }
        output = "```js\n" + snippet + "```";
    } catch (err) {}
    return output;
}

export function cleanLines (input, lines) {
    return input.split('\n').splice(0, input.split('\n').length - lines).join('\n');
}

export function detectFlag (args, flag, allFlags = []) {
    let flagLetters = allFlags.map(flagItem => flagItem[0]);
    return (
        args.includes('-'  + flag) ||
        args.includes('--' + flag) ||
        args.includes('-'  + ( flagLetters.includes(flag[0]) ? flag[0].toUpperCase() : flag[0] )) ||
        args.includes('--' + ( flagLetters.includes(flag[0]) ? flag[0].toUpperCase() : flag[0] ))
    );
}