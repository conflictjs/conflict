import { onInterval } from '../../conflict/events.js';

onInterval(120000, _ => {
    console.log("This runs every 2 minutes.")
});