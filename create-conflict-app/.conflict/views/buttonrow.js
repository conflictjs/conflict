import { View } from 'conflict.js/view';
export default function ButtonRow() {
  return (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("components", null, (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("component", {
    type: 1
  }, (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("components", null, (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("component", {
    type: 2,
    style: 5,
    url: "https://google.com"
  }, (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("label", null, "Click me!")))));
}