export function useState (defaultValue) {
    let value = defaultValue;
    let message, view;
    function setValue (newVlalue) {
        value = newValue;
    }
    function callback (sentMessage, viewInstance) {
        message = sentMessage;
        view = viewInstance;
    }
    return [value, setValue, callback];
}