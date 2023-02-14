import { managers } from "../../state.js";
import SelectOption from "./SelectOption.js";
export default function SelectMenu({
	onclick,
	onClick,
	customId,
	options,
	children,
	min,
	max,
	disabled = false,
}) {
	if (!customId && !onclick && !onClick)
		throw new Error(
			"SelectMenu must have either customId, url, or onclick props"
		);
	if (!onclick && onClick) onclick = onClick;

	if (children) {
		options = children;
	} else {
		options = options.map((option) => {
			return global.__ConflictViewParser(
				SelectOption,
				{
					value: option.value,
					description: option.description,
					emoji: option.emoji,
					default: option.default,
				},
				option.label
			);
		});
	}

	let props = {
		type: 3,
		min_values: min,
		max_values: max,
		disabled: !!disabled,
		custom_id: customId
			? customId
			: managers.components.select("*").store(onclick),
	};
	return global.__ConflictViewParser(
		"components_arr",
		null,
		global.__ConflictViewParser("component", props, options)
	);
}
