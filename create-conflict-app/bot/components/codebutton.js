import { View } from 'conflict.js/view';

export default function Button (props) {
    const { style, children, label, custom_id, url } = props;
    return (
        <component type={2} style={style || 1} url={url} custom_id={custom_id} label={label}></component>
    )
}