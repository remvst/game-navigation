import { InterpolationPool } from "@remvst/animate.js";
import { Game } from "../game/game";
import { ScreenInputs } from "../interaction/inputs";
import { ScreenDelegate } from "./screen-delegate";

export abstract class Screen {
    abstract readonly id: string;

    game: Game = null;
    cursorType: string = "default";

    inputs: ScreenInputs;
    age: number = 0;
    frameCount: number = 0;
    interpolationPool: InterpolationPool;
    delegate: ScreenDelegate | null = null;

    protected readonly subscreens: Screen[] = [];

    addSubscreen(screen: Screen) {
        this.subscreens.push(screen);
    }

    bind(game: Game) {
        this.game = game;

        for (const plugin of this.game.plugins) {
            plugin.setupScreen(this);
        }

        for (const sub of this.subscreens) {
            sub.bind(game);
        }
    }

    setup() {
        this.inputs = new ScreenInputs(this);
        this.inputs.keyboard.onKeyDown = (keyCode) => this.keyDown(keyCode);
        this.inputs.keyboard.onKeyUp = (keyCode) => this.keyUp(keyCode);
        this.inputs.mouse.onMouseDown = (button) =>
            this.mouseDown(
                button,
                this.inputs.mouse.position.x,
                this.inputs.mouse.position.y,
            );
        this.inputs.mouse.onMouseUp = (button) =>
            this.mouseUp(
                button,
                this.inputs.mouse.position.x,
                this.inputs.mouse.position.y,
            );
        this.inputs.mouse.onMouseMove = (movementX, movementY) =>
            this.mouseMove(
                this.inputs.mouse.position.x,
                this.inputs.mouse.position.y,
                movementX,
                movementY,
            );
        this.inputs.mouse.onWheel = (x, y, z) => this.wheel(x, y, z);
        this.inputs.setup();

        this.interpolationPool = new InterpolationPool();
        this.delegate?.onSetup();

        for (const sub of this.subscreens) {
            sub.setup();
        }
    }

    destroy() {
        this.interpolationPool.clear();
        this.delegate?.onDestroy();

        for (const sub of this.subscreens) {
            sub.destroy();
        }
    }

    foreground() {
        this.delegate?.onForeground();

        for (const sub of this.subscreens) {
            sub.foreground();
        }
    }

    background() {
        const newScreen = this.game.screenStack.current();
        if (newScreen.absorbInputs) {
            this.inputs.reset();
        }
        this.delegate?.onBackground();

        for (const sub of this.subscreens) {
            sub.background();
        }
    }

    cycle(elapsed: number) {
        this.age += elapsed;
        this.frameCount++;

        for (const sub of this.subscreens) {
            sub.inputs.import(this.inputs);
            sub.cycle(elapsed);
        }
    }

    postCycle(elapsed: number) {
        if (this.interpolationPool) {
            this.interpolationPool.cycle(elapsed);
        }

        for (const sub of this.subscreens) {
            sub.postCycle(elapsed);
        }
    }

    keyDown(keyCode: number) {
        for (const subscreen of this.subscreens) {
            subscreen.keyDown(keyCode);
        }
    }

    keyUp(keyCode: number) {
        for (const subscreen of this.subscreens) {
            subscreen.keyUp(keyCode);
        }
    }

    protected skip() {
        this.interpolationPool.skip();
    }

    mouseDown(button: number, x: number, y: number) {
        for (const subscreen of this.subscreens) {
            subscreen.mouseDown(button, x, y);
        }
    }

    mouseMove(x: number, y: number, movementX: number, movementY: number) {
        for (const subscreen of this.subscreens) {
            subscreen.mouseMove(x, y, movementX, movementY);
        }
    }

    mouseUp(button: number, x: number, y: number) {
        for (const subscreen of this.subscreens) {
            subscreen.mouseUp(button, x, y);
        }
    }

    wheel(deltaX: number, deltaY: number, deltaZ: number) {
        for (const subscreen of this.subscreens) {
            subscreen.wheel(deltaX, deltaY, deltaZ);
        }
    }

    addDebugValues(values: { [key: string]: any }) {
        values[`screens[${this.id}].interpolations`] =
            this.interpolationPool.size;
    }

    get isForeground() {
        return this.game && this.game.screenStack.current() === this;
    }

    get absorbInputs() {
        return true;
    }

    get absorbCycle() {
        return true;
    }

    get timeFactor() {
        return 1;
    }

    get isCycling() {
        for (let i = this.game.screenStack.screens.length - 1; i >= 0; i--) {
            const screen = this.game.screenStack.screens[i];
            if (screen === this) return true;
            if (screen.absorbCycle) return false;
        }
        return false;
    }

    get isTakingInputs() {
        for (let i = this.game.screenStack.screens.length - 1; i >= 0; i--) {
            const screen = this.game.screenStack.screens[i];
            if (screen === this) return true;
            if (screen.absorbInputs) return false;
        }
        return false;
    }

    updateLayout(): void {
        for (const subscreen of this.subscreens) {
            subscreen.updateLayout();
        }
    }
}
