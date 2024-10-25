import {
    BindingDefinition,
    BindingDefinitionSet,
    KeyBindingsSettings,
    Keyboard,
    keyboard,
    set,
} from "@remvst/client-inputs";

export const KEY_BINDINGS = (() => {
    const definitions = new BindingDefinitionSet([
        new BindingDefinition(
            "navigation",
            "changeColor",
            "Change Color",
            true,
            set(keyboard(Keyboard.ESC), keyboard(Keyboard.BACKSPACE)),
        ),
        new BindingDefinition(
            "navigation",
            "2dmode",
            "Switch to 2D Mode",
            true,
            set(keyboard(Keyboard.NUM_2)),
        ),
        new BindingDefinition(
            "navigation",
            "3dmode",
            "Switch to 3D Mode",
            true,
            set(keyboard(Keyboard.NUM_3)),
        ),
    ]);

    return new KeyBindingsSettings(definitions);
})();
