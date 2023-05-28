export default {
	intents: ["GUILDS", "GUILD_MESSAGES"],
	plugins: [import("conflict/global-ratelimit-plugin")],
	runtimes: ["@conflict/vercel"]
};