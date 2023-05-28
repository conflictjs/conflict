export const useState = (defaultValue) => {
    let value = defaultValue;
    let message, view;
    function setValue (newValue) {
        value = newValue;
    }
    function callback (sentMessage, viewInstance) {
        message = sentMessage;
        view = viewInstance;
    }
    return [value, setValue, callback];
};

const Conflict = {
    useState
};

export default Conflict;