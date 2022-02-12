import { MessageAttachment } from 'discord.js';
export default function Attachment({
  url,
  attachment,
  name,
  description,
  children
}) {
  if (url) {
    return global.__ConflictViewParser("files_arr", null, url);
  } else return global.__ConflictViewParser("files_arr", null, global.__ConflictViewParser("file", {
    description,
    name,
    attachment
  }, children));
}