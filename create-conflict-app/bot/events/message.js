import { onMessageCreate } from 'conflict.js/events';
import Welcome from '../views/welcome.js';

onMessageCreate(message => {
    if (message.content === "hello") message.channel.send(":wave: Hey there!");
    if (message.content === "welcome") message.channel.send(Welcome());
});