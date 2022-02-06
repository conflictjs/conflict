import { View } from 'conflict.js/view';

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