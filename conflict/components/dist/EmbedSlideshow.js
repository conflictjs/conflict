import ActionRow from "./ActionRow.js";
import Button from "./Button.js";
export default function EmbedSlideshow({ embeds }) {
	let activeEmbed = embeds[0];
	return global.__ConflictViewParser(
		"message",
		null,
		activeEmbed,
		global.__ConflictViewParser(
			ActionRow,
			null,
			global.__ConflictViewParser(
				Button,
				{
					onclick: (event) => event.respond("OK"),
				},
				"<<"
			),
			global.__ConflictViewParser(
				Button,
				{
					onclick: (event) => event.respond("OK"),
				},
				"←"
			),
			global.__ConflictViewParser(
				Button,
				{
					onclick: (event) => event.respond("OK"),
					disabled: true,
				},
				embeds.indexOf(activeEmbed) + 1
			),
			global.__ConflictViewParser(
				Button,
				{
					onclick: (event) => event.respond("OK"),
				},
				"→"
			),
			global.__ConflictViewParser(
				Button,
				{
					onclick: (event) => event.respond("OK"),
				},
				">>"
			)
		)
	);
}
