import { View } from 'conflict.js/view';
import Button from './button.js';
import ComponentRow from './componentrow.js';
export default function Counter(number) {
  return new View(global.__ConflictViewParser("message", null, global.__ConflictViewParser(ComponentRow, null, global.__ConflictViewParser(Button, {
    label: "Hello",
    url: "https://google.com",
    style: 5
  })), global.__ConflictViewParser("embeds", null, global.__ConflictViewParser("embed", {
    color: "#ff3333"
  }, global.__ConflictViewParser("title", null, "Counter: ", number)))));
}