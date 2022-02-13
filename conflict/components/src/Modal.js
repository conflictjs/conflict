import { managers } from '../../state.js';

export default function Modal ({ children, onsubmit, onSubmit, title }) {
    if (!onsubmit && onSubmit) onsubmit = onSubmit;
    if (!onsubmit) throw new Error('Modal must have onsubmit prop');
    return (
        <modal title={title} custom_id={managers.components.select('*').store(onsubmit)}>
            {children}
        </modal>
    )
}