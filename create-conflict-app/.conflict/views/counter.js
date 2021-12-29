import { View } from '../../conflict/view.js';
import Button from './button.js';
import ComponentRow from './componentrow.js';
export default function Counter(number) {
  return new View(View.createElement("message", null, View.createElement(ComponentRow, null, View.createElement(Button, {
    label: "Hello",
    url: "https://google.com",
    style: 5
  })), View.createElement("embeds", null, View.createElement("embed", {
    color: "#ff3333"
  }, View.createElement("title", null, "Counter: ", number)))));
}