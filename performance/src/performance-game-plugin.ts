import { GamePlugin } from "@remvst/game-navigation-core";
import GameStats from "gamestats.js";

export class PerformanceGamePlugin extends GamePlugin {
    static readonly key = "performance";
    readonly key = PerformanceGamePlugin.key;

    readonly gameStats = new GameStats({
        autoPlace: false,
    });

    constructor(private readonly performanceRendererContainer: HTMLElement) {
        super();
    }

    setup(): void {
        super.setup();

        this.performanceRendererContainer.appendChild(this.gameStats.dom);
    }

    setRendererVisible(visible: boolean) {
        this.gameStats.show(visible);
    }

    onFrameStart() {
        this.gameStats.begin();
    }

    onFrameEnd() {
        this.gameStats.end();
    }

    onCycleStart() {
        this.gameStats.begin("cycle", "#0000ff");
    }

    onCycleEnd() {
        this.gameStats.end("cycle");
    }

    onRenderStart() {
        this.gameStats.begin("render", "#ffff00");
    }

    onRenderEnd() {
        this.gameStats.end("render");
    }
}
