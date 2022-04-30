export default function ActionRow ({ children }) {
    return (
        <components_arr> {/** output an array of Discord message components */}
            <component type={1}>
                {children}
            </component>
        </components_arr>
    )
}