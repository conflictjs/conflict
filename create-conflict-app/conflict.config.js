export default {
	intents: ["GUILDS", "GUILD_MESSAGES"],
	plugins: [import("@conflict/beta/global-ratelimit-plugin")],
};