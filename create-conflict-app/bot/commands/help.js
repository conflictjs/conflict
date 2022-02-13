import Command from '@conflict/beta/commands';
import { Button, StatelessButton, ActionRow, Embed, SelectMenu, SelectOption, TextInput, Modal } from '@conflict/beta/components';
import View from '@conflict/beta/View';

export default new Command({
    name: 'help',
    description: 'Get help',
    options: [],
    testing: {
        guildId: '921962253262155876'
    },
    execute: async (command, options, utils) => {
        const buttonView = (
            <message>
                <Embed color="#ff3333" image={{ url: "https://www.gitbook.com/cdn-cgi/image/width=32,height=32,fit=contain,dpr=1,format=auto/https%3A%2F%2Ffiles.gitbook.com%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FqKkjNKHtBhCUHveEGTY2%252Ficon%252F2sgixS2pVqtWMiBvRGg2%252FConflict.png%3Falt%3Dmedia%26token%3D24c0b0f6-f987-46ca-b4a5-8f193d650bcb" }}>
                        <title>Hello, world!</title>
                        <description>Welcome to **Conflict**.</description>
                </Embed>

                <ActionRow>
                    <StatelessButton onclick={(event) => {
                        event.respond({ content: 'You clicked me!', ephemeral: true });
                    }} variant="green">Green Button</StatelessButton>
                </ActionRow>

                <ActionRow>
                    <Button onclick={(event) => {

                        event.modal( // Open up a popup modal with this JSX
                            <Modal title="im a modal, duh" onSubmit={(form) => {
                                form.respond('submitted lol. raw form responses: ' + JSON.stringify(form.values)); // Run this when it's submitted
                            }}>

                                <ActionRow> {/* Define a row and put a text input inside of it */}
                                    <TextInput label="im a text input" placeholder="i hold the place" variant="input" name="i_am_an_input" />
                                </ActionRow>

                            </Modal>
                        )

                    }} variant="cta">Open Modal</Button>
                </ActionRow>

                <ActionRow>
                    <SelectMenu onclick={(event) => {
                        event.respond({ content: `You selected ${JSON.stringify(event.values)}`, ephemeral: true });
                    }}>

                        <SelectOption value="option_1">This the first option.</SelectOption>
                        <SelectOption value="option_2">This is the second option.</SelectOption>

                    </SelectMenu>
                </ActionRow>
            </message>
        );
        command.respond(buttonView);
    }
});