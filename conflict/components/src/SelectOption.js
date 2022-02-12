export default function SelectOption ({ label, value, description, emoji, children, ...props }) {
    if (children) {
        label = (
            <label>{children[0]}</label>
        );
    } else {
        label = (
            <label>{label}</label>
        );
    }
    return (
        <options_arr>
            <option {...{
                value,
                description,
                emoji,
                default: props.default
            }}>
                {label}
            </option>
        </options_arr>
    )
}