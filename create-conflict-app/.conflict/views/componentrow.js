import { View } from '../../djsx.js';
export default function ComponentRow({
  children
}) {
  return View.createElement("components", null, View.createElement("component", {
    type: 1
  }, View.createElement("components", null, children)));
}