export default function Attachment ({ url, attachment, name, description, children }) {
    if (url) {
        return (
            <files_arr>{url}</files_arr>
        );
    } else return (
        <files_arr>
            <file {...{
                description,
                name,
                attachment
            }}>
                {children}
            </file>
        </files_arr>
    );
}