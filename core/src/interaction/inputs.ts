import {
    DOMGamepadInputs,
    DOMKeyboardInputs,
    DOMMouseInputs,
    Inputs,
} from "@remvst/client-inputs";
import GamepadInputs from "@remvst/client-inputs/lib/gamepad/gamepad-inputs";
import KeyboardInputs from "@remvst/client-inputs/lib/keyboard/keyboard-inputs";
import { Game } from "../game/game";
import { Screen } from "../ui/screen";
import { between } from "../util/math";
import { ScreenMouseInputs } from "./screen-mouse-inputs";

export class ScreenInputs implements Inputs {
    readonly keyboard = new KeyboardInputs();
    readonly mouse = new ScreenMouseInputs(this.screen.game.params);
    readonly gamepad = new GamepadInputs();

    constructor(readonly screen: Screen) {}

    setup() {
        this.keyboard.setup();
        this.mouse.setup();
        this.gamepad.setup();
    }

    reset() {
        this.keyboard.reset();
        this.mouse.reset();
        this.gamepad.reset();
    }

    import(other: Inputs) {
        this.keyboard.import(other.keyboard);
        this.mouse.import(other.mouse);
        this.gamepad.import(other.gamepad);
    }
}

export class GameInputs implements Inputs {
    readonly keyboard = new DOMKeyboardInputs();
    readonly mouse = new DOMMouseInputs(this.game.container, this.game.params);
    readonly gamepad = new DOMGamepadInputs();

    constructor(private readonly game: Game) {
        this.keyboard.onKeyDown = (keyCode: number) => {
            this.makeGamepadInactive();
            this.loopScreens((inputs) =>
                inputs.keyboard.setDown(keyCode, true),
            );
        };
        this.keyboard.onKeyUp = (keyCode: number) => {
            this.makeGamepadInactive();
            this.loopScreens((inputs) =>
                inputs.keyboard.setDown(keyCode, false),
            );
        };

        this.mouse.onMouseDown = (button) => {
            this.makeGamepadInactive();
            this.loopScreens((inputs) =>
                inputs.mouse.setButtonDown(button, true),
            );
        };
        this.mouse.onMouseUp = (button) => {
            this.makeGamepadInactive();
            this.loopScreens((inputs) =>
                inputs.mouse.setButtonDown(button, false),
            );
        };
        this.mouse.onWheel = (x, y, z) => {
            this.makeGamepadInactive();
            this.loopScreens((inputs) => inputs.mouse.onWheel(x, y, z));
        };

        this.mouse.onMouseMove = (movementX, movementY) => {
            this.makeGamepadInactive();

            const x = between(0, this.mouse.position.x, this.game.params.width);
            const y = between(
                0,
                this.mouse.position.y,
                this.game.params.height,
            );

            this.loopScreens((inputs) =>
                inputs.mouse.setMousePosition(x, y, movementX, movementY),
            );
        };

        this.gamepad.onButtonDown = (button) =>
            this.loopScreens((inputs) => inputs.gamepad.setDown(button, true));
        this.gamepad.onButtonUp = (button) =>
            this.loopScreens((inputs) => inputs.gamepad.setDown(button, false));
        this.gamepad.onAxisUpdated = (axis, value) =>
            this.loopScreens((inputs) => inputs.gamepad.setAxis(axis, value));
    }

    setup() {
        this.keyboard.setup();
        this.mouse.setup();
        this.gamepad.setup();

        window.addEventListener("blur", () => this.reset(), false);
    }

    reset() {
        this.keyboard.reset();
        this.mouse.reset();
        this.gamepad.reset();

        for (const screen of this.game.screenStack.screens) {
            screen.inputs.reset();
        }
    }

    private makeGamepadInactive() {
        this.gamepad.isActive = false;
        for (const screen of this.game.screenStack.screens) {
            screen.inputs.gamepad.isActive = false;
        }
    }

    private loopScreens(func: (inputs: Inputs) => void) {
        for (let i = this.game.screenStack.screens.length - 1; i >= 0; i--) {
            const screen = this.game.screenStack.screens[i];
            func(screen.inputs);

            if (screen.absorbInputs) {
                break;
            }
        }
    }

    preventDefault() {
        this.keyboard.preventDefault();
    }
}
