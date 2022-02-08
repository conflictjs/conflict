import { onInterval } from '@conflict/beta/events';

onInterval(120000, _ => {
    console.log("This runs every 2 minutes.")
});