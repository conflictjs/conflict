import { onMessageCreate } from '../../conflict/events.js';

onMessageCreate(message => {
    if (message.content === "hello") message.channel.send(":wave: Hey there!");
});