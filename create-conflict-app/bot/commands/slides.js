import Command from '@conflict/beta/commands';
import { EmbedSlideshow, Button, StatelessButton, ActionRow, Embed, SelectMenu, SelectOption, TextInput, Modal } from '@conflict/beta/components';
import View from '@conflict/beta/View';

export default new Command({
    name: 'slides',
    description: 'Run slides',
    options: [],
    testing: {
        guildId: '921962253262155876'
    },
    execute: async (command, options, utils) => {
        command.respond(
            <EmbedSlideshow embeds={[
                <Embed title="Hello">
                    <description>hi</description>
                </Embed>
            ]} />
        )
    }
});