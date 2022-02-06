import { View } from 'conflict.js/view';
import Button from './button.js';
import ComponentRow from './componentrow.js';
export default function Counter(number) {
  return new View((typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("message", null, (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)(ComponentRow, null, (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)(Button, {
    label: "Hello",
    url: "https://google.com",
    style: 5
  })), (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("embeds", null, (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("embed", {
    color: "#ff3333"
  }, (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("title", null, "Counter: ", number)))));
}