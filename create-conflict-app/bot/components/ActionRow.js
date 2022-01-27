import { View } from '../../conflict/view.js';

export default function ActionRow ({ children }) {
    return (
        <components>
            <component type={1}>
                <components>
                    {children}
                </components>
            </component>
        </components>     
    )
}