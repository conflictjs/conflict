export default function plugin ({ client, events, logger }) {
    events.onDebug(debug => {
        if (debug.startsWith('429 on /gateway/bot')) {
            logger.error('429 login ratelimit');
        }
    });
} // A simple example plugin to tell you when you have a 429 on a login request

