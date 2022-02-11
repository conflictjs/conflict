import { managers } from '../state.js';
export default function Button({
  style,
  onclick,
  customId,
  url,
  label,
  children,
  emoji
}) {
  console.log('[children]', children);
  console.log('[label]', label);
  label = children && children.length ? global.__ConflictViewParser("label", null, children[0]) : global.__ConflictViewParser("label", null, label);
  if (!style) style = url ? 5 : 1;
  if (!customId && !url && !onclick) throw new Error('Button must have either customId, url, or onclick props');
  let props = {
    style,
    type: 2,
    url: style === 5 ? url : undefined,
    custom_id: style !== 5 ? customId ? customId : managers.components.select('*').store(onclick) : undefined
  };
  return global.__ConflictViewParser("components_arr", null, global.__ConflictViewParser("component", props, label));
}