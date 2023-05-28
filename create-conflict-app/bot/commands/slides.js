import Command from 'conflict/commands';
import { EmbedSlideshow, Button, StatelessButton, ActionRow, Embed, SelectMenu, SelectOption, TextInput, Modal } from 'conflict/components';
import View from 'conflict/View';

export default new Command({
    name: 'slides',
    description: 'Run slides',
    options: [
        {
            "type": 3,
            "name": "text",
            "description": "Text to display",
        }
    ],
    execute: async (command, options, utils) => {
        // command.respond(
        //     <EmbedSlideshow embeds={[
        //         <Embed title="Hello">
        //             <description>hi</description>
        //         </Embed>
        //     ]} />
        // )
        command.respond(
            <message>
                <content>Hello</content>
                <ActionRow>
                    <Button onclick={(event) => event.respond('OK')} emoji={{
                        name: '⏪'
                    }} variant={1}></Button>
                </ActionRow>
                {/*`⏪ ⬅️ 🔵 ➡️ ⏩
⏪ ⬅️ ⏺️ ➡️ ⏩
⏪ ⬅️ 🟦 ➡️ ⏩
⏪ ⬅️ ⏹️ ➡️ ⏩
        ⏪ ⬅️ ⏺️ ➡️ ⏩`*/}
            </message>
        )
    }
});