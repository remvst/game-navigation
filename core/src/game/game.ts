import { PerformanceRecorder } from "@remvst/client-performance";
import { GameInputs } from "../interaction/inputs";
import { ScreenStack } from "../navigation/screen-stack";
import { GameParams } from "./game-params";
import { GamePlugin } from "./game-plugin";

export abstract class Game<ParamsType extends GameParams = GameParams> {
    private readonly pluginMap = new Map<string, GamePlugin>();

    // Inputs
    inputs: GameInputs;

    // Screens
    screenStack: ScreenStack;

    // Time
    age = 0;
    private lastFrame: number;

    // Cycle loop
    private animationFrameId: number;
    private runningLoop = false;

    // Performance
    readonly performanceRecorder = new PerformanceRecorder({
        recordCount: Math.floor(window.innerWidth / 3),
    });

    constructor(readonly params: ParamsType) {
        this.parseURL();
    }

    abstract get plugins(): GamePlugin[];

    abstract get container(): HTMLElement;

    plugin<T extends GamePlugin>(
        keyProvider: (new (...params: any) => T) & { key: string },
    ): T {
        return this.pluginMap.get(keyProvider.key) as T;
    }

    setup() {
        this.inputs = new GameInputs(this);
        this.inputs.setup();

        this.screenStack = new ScreenStack(this);

        for (const plugin of this.plugins) {
            plugin.bind(this);
            this.pluginMap.set(plugin.key, plugin);
        }

        for (const plugin of this.plugins) {
            plugin.setup();
        }

        this.lastFrame = window.performance.now();
        this.scheduleFrame();
    }

    scheduleFrame() {
        if (this.animationFrameId) {
            return;
        }

        const callback = () => {
            this.animationFrameId = null;
            this.frame();
        };

        this.runningLoop = true;

        if (!this.params.fps) {
            this.animationFrameId = window.requestAnimationFrame(callback);
        } else {
            setTimeout(callback, 1000 / this.params.fps);
        }
    }

    stopLoop() {
        this.runningLoop = false;
        window.cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
    }

    frame() {
        this.performanceRecorder.roll();
        this.performanceRecorder.onStart("FRAME");

        const now = window.performance.now();
        const elapsedMs = now - this.lastFrame;
        const elapsed = Math.min(
            this.params.maxFrameInterval || 1,
            elapsedMs / 1000,
        );

        this.lastFrame = now;

        this.cycle(elapsed);

        this.performanceRecorder.onStart("RENDER");
        for (const plugin of this.plugins) {
            plugin.render();
        }
        this.performanceRecorder.onEnd("RENDER");

        this.performanceRecorder.onEnd("FRAME");

        if (this.runningLoop) {
            this.scheduleFrame();
        }
    }

    cycle(elapsed: number) {
        // Safety in case we resume the game after a while
        let adjusted = Math.min(elapsed, this.params.maxFrameInterval || 1);

        for (const plugin of this.plugins) {
            adjusted *= plugin.timeFactor;
        }

        const screen = this.screenStack.current();
        if (screen) {
            adjusted *= this.screenStack.current().timeFactor;
        }

        this.age += elapsed;

        const screens = this.screenStack.screens.slice();
        for (let i = screens.length - 1; i >= 0; i--) {
            const screen = screens[i];
            screen.cycle(adjusted);
            screen.postCycle(adjusted);

            if (screen.absorbCycle) {
                break;
            }
        }

        for (const plugin of this.plugins) {
            plugin.cycle(elapsed);
        }
    }

    getDebugValues(out: { [key: string]: any }) {
        this.screenStack.current()?.addDebugValues(out);
    }

    private parseURL() {
        const params = new URLSearchParams(
            (document.location.search || "?").substr(1),
        );
        for (const [param, originalValue] of params.entries()) {
            let value = originalValue as any;
            if (value === "true" || value === "false") {
                value = JSON.parse(value);
            } else if (!Number.isNaN(value)) {
                value = parseFloat(value) || value;
            }

            (this.params as any)[param] = value;
        }
    }

    onCurrentScreenChanged() {
        (window as any).S = this.screenStack.current();
        this.container.style.cursor = this.screenStack.current()?.cursorType;
    }
}
