export default function SelectOption({
	label,
	value,
	description,
	emoji,
	children,
	...props
}) {
	if (children) {
		label = global.__ConflictViewParser("label", null, children[0]);
	} else {
		label = global.__ConflictViewParser("label", null, label);
	}

	return global.__ConflictViewParser(
		"options_arr",
		null,
		global.__ConflictViewParser(
			"option",
			{
				value,
				description,
				emoji,
				default: props.default,
			},
			label
		)
	);
}
