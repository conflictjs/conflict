export default function Embed ({ title, description, url, timestamp, color, footer, image, thumbnail, video, provider, author, fields, children }) {
    return (
        <embeds_arr>
            <embed {...{
                title, description, url, timestamp, color, footer, image, thumbnail, video, provider, author, fields
            }}>
                {children}
            </embed>
        </embeds_arr>
    )
}