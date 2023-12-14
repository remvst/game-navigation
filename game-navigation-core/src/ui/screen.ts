import { InterpolationPool } from '@remvst/animate.js';
import { Game } from '../game/game';
import { ScreenDelegate } from './screen-delegate';
import { ScreenInputs } from '../interaction/inputs';

export abstract class Screen {

    game: Game;
    cursorType: string = 'default';

    inputs: ScreenInputs;
    age: number = 0;
    frameCount: number = 0;
    interpolationPool: InterpolationPool;
    delegate: ScreenDelegate | null = null;

    private readonly subscreens: Screen[] = [];

    constructor() {
        this.game = null;
    }

    addSubscreen(screen: Screen) {
        this.subscreens.push(screen);
    }

    bind(game: Game) {
        this.game = game;
        this.game.setupScreen(this);

        for (const sub of this.subscreens) {
            sub.bind(game);
        }
    }

    abstract get id(): string;

    setup() {
        this.inputs = new ScreenInputs(this);
        this.inputs.keyboard.onKeyDown = (keyCode) => this.keyDown(keyCode);
        this.inputs.keyboard.onKeyUp = (keyCode) => this.keyUp(keyCode);
        this.inputs.mouse.onMouseDown = (button) => this.mouseDown(button, this.inputs.mouse.position.x, this.inputs.mouse.position.y);
        this.inputs.mouse.onMouseUp = (button) => this.mouseUp(button, this.inputs.mouse.position.x, this.inputs.mouse.position.y);
        this.inputs.mouse.onMouseMove = (movementX, movementY) => this.mouseMove(this.inputs.mouse.position.x, this.inputs.mouse.position.y, movementX, movementY);
        this.inputs.mouse.onWheel = (x, y, z) => this.wheel(x, y, z);
        this.inputs.setup();

        this.interpolationPool = new InterpolationPool();
        this.delegate?.onSetup();

        for (const sub of this.subscreens) {
            sub.setup();
        }
    }

    destroy() {
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

    addDebugValues(values: {[key: string]: any}) {
        values['screen.id'] = this.id;
        values['interpolations'] = this.interpolationPool.size;
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
}
