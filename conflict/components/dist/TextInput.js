import { managers } from '../../state.js';
export default function TextInput({
  onclick,
  onClick,
  customId,
  value,
  label,
  required = false,
  placeholder,
  children,
  min,
  max,
  variant
}) {
  if (!customId && !onclick && !onClick) throw new Error('TextInput must have either customId, url, or onclick props');
  if (!onclick && onClick) onclick = onClick;

  if (children) {
    value = global.__ConflictViewParser("value", null, children[0]);
  } else {
    value = global.__ConflictViewParser("value", null, value);
  }

  if (!style) style = variant;

  if (!(style >= 1 && style <= 2)) {
    switch ((style + '').toLowerCase()) {
      case 'short':
      case 'single-line':
      case 'line':
      case 'input':
        style = 1;
        break;

      case 'paragraph':
      case 'multi-line':
      case 'textarea':
        style = 2;
        break;

      default:
        style = 1;
        break;
    }
  }

  let props = {
    type: 4,
    min_length: min,
    max_length: max,
    placeholder,
    label,
    required,
    custom_id: customId ? customId : managers.components.select('*').store(onclick)
  };
  return global.__ConflictViewParser("components_arr", null, global.__ConflictViewParser("component", props, value));
}