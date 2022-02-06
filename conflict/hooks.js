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

export function deleteAfter (time = 5000) { // Called when creating the view
    return function (message, view) { // Called after message is sent
        setTimeout(() => {
            message.delete();
        }, time);
    }
}