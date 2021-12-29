import events from 'conflict/events'

events.message(message => {
    console.log(message.content);
});