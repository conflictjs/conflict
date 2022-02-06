import { useState } from 'conflict.js/hooks';
import { View } from 'conflict.js/view';
import Button from './button.js';
import ComponentRow from './componentrow.js';

export default function Counter () {
    const [number, setNumber, numberCallback] = useState(0);
    return new View(
        <message>
            <ComponentRow>
                <Button label="Hello" url="https://google.com" style={5}></Button>
            </ComponentRow>
            <embeds>
                <embed color="#ff3333">
                    <title>Counter: {number}</title>
                </embed>
            </embeds>
        </message>
    ).applyHooks(numberCallback);
}