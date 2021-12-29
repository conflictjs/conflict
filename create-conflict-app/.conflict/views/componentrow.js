import { View } from '../../conflict/view.js';
export default function ComponentRow({
  children
}) {
  return View.createElement("components", null, View.createElement("component", {
    type: 1
  }, View.createElement("components", null, children)));
}