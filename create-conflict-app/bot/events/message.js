import { onMessage } from 'conflict/events';

onMessage(message => {
    if (message.content === "hello") message.channel.send(":wave: Hey there!");
});