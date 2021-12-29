import { View } from '../../conflict/view';

export default function ComponentRow ({ children }) {
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