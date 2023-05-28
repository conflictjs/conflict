export default function ActionRow({ children }) {
	return global.__ConflictViewParser(
		"components_arr",
		null,
		global.__ConflictViewParser(
			"component",
			{
				type: 1,
			},
			children
		)
	);
}
