function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
import { managers } from "../../state.js";
export default function ServerlessButton(param) {
    var style = param.style, onclick = param.onclick, label = param.label, children = param.children, emoji = param.emoji, variant = param.variant, name = param.name, params = param.params;
    label = children && children.length ? /*#__PURE__*/ global.__ConflictViewParser("label", null, children[0]) : /*#__PURE__*/ global.__ConflictViewParser("label", null, label);
    if (!style) style = variant ? variant : 1;
    if (!(style >= 1 && style <= 4)) {
        switch((style + "").toLowerCase()){
            case "primary":
            case "cta":
            case "purple":
            case "blurple":
                style = 1;
                break;
            case "green":
            case "success":
            case "good":
                style = 3;
                break;
            case "grey":
            case "gray":
            case "secondary":
            case "dark":
                style = 2;
                break;
            case "danger":
            case "fail":
            case "failed":
            case "error":
            case "red":
            case "bad":
                style = 4;
                break;
            default:
                style = 1;
                break;
        }
    }
    if (!onclick && !onClick) throw new Error("Button must have onclick prop");
    if (!onclick && onClick) onclick = onClick;
    var props = {
        style: style,
        emoji: emoji,
        type: 2,
        custom_id: "!" + JSON.stringify([
            name,
            params
        ])
    };
    return /*#__PURE__*/ global.__ConflictViewParser("components_arr", null, /*#__PURE__*/ global.__ConflictViewParser("component", _extends({}, props), label));
}
