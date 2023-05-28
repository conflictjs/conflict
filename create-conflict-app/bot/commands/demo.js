

export const name = "Demo";
export const description = "Run demo";
export const options = [
    {
        "type": 3,
        "name": "text",
        "description": "Text to display",
    }
];

export default function demo ({ count, text }) {
    

    return (
        <message>
            <content>Hello</content>
            <ActionRow>
                <Button onclick={() => setState()} variant={1}>Count</Button>
            </ActionRow>
        </message>
    );
}

export function getProps ({ args, interaction }) {
    return {
        count: 0,
        text: args[0] || 'Hello'
    };
}