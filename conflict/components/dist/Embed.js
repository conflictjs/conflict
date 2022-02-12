export default function Embed({
  title,
  description,
  url,
  timestamp,
  color,
  footer,
  image,
  thumbnail,
  video,
  provider,
  author,
  fields,
  children
}) {
  return global.__ConflictViewParser("embeds_arr", null, global.__ConflictViewParser("embed", {
    title,
    description,
    url,
    timestamp,
    color,
    footer,
    image,
    thumbnail,
    video,
    provider,
    author,
    fields
  }, children));
}