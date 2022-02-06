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
