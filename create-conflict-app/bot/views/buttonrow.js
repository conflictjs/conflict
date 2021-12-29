import { View } from '../../conflict/view.js';

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