import { View } from 'conflict.js/view';
export default function ButtonRow() {
  return global.__ConflictViewParser("components", null, global.__ConflictViewParser("component", {
    type: 1
  }, global.__ConflictViewParser("components", null, global.__ConflictViewParser("component", {
    type: 2,
    style: 5,
    url: "https://google.com"
  }, global.__ConflictViewParser("label", null, "Click me!")))));
}