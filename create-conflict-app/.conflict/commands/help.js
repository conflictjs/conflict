import Command from '../../conflict/commands.js';
import ActionRow from '../components/ActionRow.js';
import Button from '../components/Button.js';
export default new Command({
  name: 'help',
  description: 'Get help',
  options: [],
  testing: {
    guildId: '921962253262155876'
  },
  execute: async (command, options, utils) => {
    command.view((typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("message", null, (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("embeds", null, (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("embed", {
      color: "#ff3333",
      image: {
        url: "https://www.gitbook.com/cdn-cgi/image/width=32,height=32,fit=contain,dpr=1,format=auto/https%3A%2F%2Ffiles.gitbook.com%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FqKkjNKHtBhCUHveEGTY2%252Ficon%252F2sgixS2pVqtWMiBvRGg2%252FConflict.png%3Falt%3Dmedia%26token%3D24c0b0f6-f987-46ca-b4a5-8f193d650bcb"
      }
    }, (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("title", null, "Hello, world!"), (typeof View !== 'undefined' ? View.createElement : command.getView().createElement)("description", null, "Welcome to **Conflict**.")))));
  }
});