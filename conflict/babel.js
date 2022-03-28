export default function() {
    return {
        visitor: {
            ImportDeclaration(path) {
                if (path.node.source.value.startsWith('.')) { // Only if it's a relative path?
                    path.node.source.value += "?n=" + (Date.now() + "" + Math.floor(Math.random() * 10000));
                }
            }
        }
    };
}