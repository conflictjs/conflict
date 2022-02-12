import { managers } from '../../state.js';
export default function Button({
  style,
  onclick,
  label,
  children,
  emoji,
  variant,
  onClick
}) {
  console.log('[children]', children);
  console.log('[label]', label);
  label = children && children.length ? global.__ConflictViewParser("label", null, children[0]) : global.__ConflictViewParser("label", null, label);
  if (!style) style = variant ? variant : 1;

  if (!(style >= 1 && style <= 4)) {
    switch ((style + '').toLowerCase()) {
      case 'primary':
      case 'cta':
      case 'purple':
      case 'blurple':
        style = 1;
        break;

      case 'green':
      case 'success':
      case 'good':
        style = 3;
        break;

      case 'grey':
      case 'gray':
      case 'secondary':
      case 'dark':
        style = 2;
        break;

      case 'danger':
      case 'fail':
      case 'failed':
      case 'error':
      case 'red':
      case 'bad':
        style = 4;
        break;

      default:
        style = 1;
        break;
    }
  }

  if (!onclick && !onClick) throw new Error('Button must have onclick prop');
  if (!onclick && onClick) onclick = onClick;
  let props = {
    style,
    emoji,
    type: 2,
    custom_id: managers.components.select('*').statelessStore(onclick)
  };
  return global.__ConflictViewParser("components_arr", null, global.__ConflictViewParser("component", props, label));
}