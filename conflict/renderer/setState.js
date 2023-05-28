
export function setState (modifications) {
    try {
        let triggerUpdate = false;

        if (__ConflictRenderState) {
            for (const key in modifications) {
                if (__ConflictRenderState[key] !== modifications[key]) triggerUpdate = true;

                __ConflictRenderState[key] = modifications[key];
            }

            return __ConflictRenderState;
        }

        if (triggerUpdate && __ConflictTriggerUpdate) __ConflictTriggerUpdate();
    } catch (err) {}

    return null;
}

export default setState;