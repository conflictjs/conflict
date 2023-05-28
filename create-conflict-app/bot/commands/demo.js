import { ActionRow } from "conflict/components";

export const name = "counter";
export const description = "Play with a counter";
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
            <content>Hello! Current count: {count}. Custom text: {text}.</content>
            <ActionRow>
                <Button onclick={() => {
                    setState({ count: count + 1 });
                }} variant={1}>
                    Count
                </Button>
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