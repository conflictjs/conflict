import { managers } from '../../state.js';

export default function Button ({ style, onclick, customId, url, label, children, emoji, variant }) {
    console.log('[children]', children);
    console.log('[label]', label);
    label = (children && children.length) ? (
        <label>{children[0]}</label>
    ) : (
        <label>{label}</label>
    );
    if (!style) style = variant ? variant : (url ? 5 : 1);
    
    if (!(style >= 1 && style <= 5)) {
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

            case 'url':
            case 'link':
            case 'popup':
                style = 5;
                break;
                
            default:
                style = 1;
                break;
        }
    }

    if (!customId && !url && !onclick) throw new Error('Button must have either customId, url, or onclick props');
    let props = {
        style,
        type: 2,
        url: style === 5 ? url : undefined,
        custom_id: style !== 5 ? (
            customId ? customId : managers.components.select('*').store(onclick)
        ) : undefined
    };
    return (
        <components_arr>
            <component {...props}>
                {label}
            </component>
        </components_arr>
    )
}