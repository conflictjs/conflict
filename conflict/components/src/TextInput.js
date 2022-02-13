import { managers } from '../../state.js';

export default function TextInput ({ name, value, label, style, required = false, placeholder, children, min, max, variant }) {
    if (!name) throw new Error('TextInput must have a name');
    if (!value && children && children[0]) {
        value = children[0];
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
        value,
        required,
        style,
        custom_id: name
    };
    return (
        <components_arr>
            <component {...props}>
                <label>{label}</label>
            </component>
        </components_arr>
    )
}