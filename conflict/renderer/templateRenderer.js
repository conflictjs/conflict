import View from "./view.js";

export function renderTemplate (template, props) {
    const rawJsx = template(props);
    const __ConflictRenderState = props;
    const __ConflictTriggerUpdate = () => {
        
    };

    const view = new View(rawJsx);
    return view;
}