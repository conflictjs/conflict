import { View } from '../../djsx.js';
export default function ButtonRow() {
  return View.createElement("components", null, View.createElement("component", {
    type: 1
  }, View.createElement("components", null, View.createElement("component", {
    type: 2,
    style: 5,
    url: "https://google.com"
  }, View.createElement("label", null, "Click me!")))));
}