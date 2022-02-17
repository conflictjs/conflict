import ActionRow from './ActionRow.js';
import Button from './Button.js';

export default function EmbedSlideshow ({ embeds }) {
    let activeEmbed = embeds[0];
    return (
        <message>
            {activeEmbed}
            <ActionRow>
                <Button onclick={(event) => event.respond('OK')}>{'<<'}</Button>
                <Button onclick={(event) => event.respond('OK')}>{'←'}</Button>
                <Button onclick={(event) => event.respond('OK')} disabled={true}>{embeds.indexOf(activeEmbed) + 1}</Button>
                <Button onclick={(event) => event.respond('OK')}>{'→'}</Button>
                <Button onclick={(event) => event.respond('OK')}>{'>>'}</Button>
            </ActionRow>
        </message>
    )
}