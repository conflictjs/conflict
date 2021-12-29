import { onMessageCreate } from '../../conflict/events.js';
import Counter from '../views/state.js';

onMessageCreate(message => {
    if (message.content === "hello") message.channel.send(":wave: Hey there!");
    if (message.content === "embed") message.channel.send(":wave: Hey there!");
});