import { onInterval } from 'conflict.js/events';

onInterval(120000, _ => {
    console.log("This runs every 2 minutes.")
});