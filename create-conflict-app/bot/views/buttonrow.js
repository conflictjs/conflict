import { View } from 'conflict.js/view';

export default function ButtonRow () {
    return (
        <components>
            <component type={1}>
                <components>
                    <component type={2} style={5} url="https://google.com">
                        <label>Click me!</label>
                    </component>
                </components>
            </component>
        </components>     
    )
}