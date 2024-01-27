import { GamePlugin } from "@remvst/game-navigation-core";
import { PerformanceRenderer, renderExecutionTime, renderFramerate } from '@remvst/client-performance';

export class PerformanceGamePlugin extends GamePlugin {

    static readonly key = 'performance';
    readonly key = PerformanceGamePlugin.key;

    private performanceRenderer: PerformanceRenderer;
    private visible: boolean = false;

    constructor(
        private readonly performanceRendererContainer: HTMLElement,
    ) {
        super();
    }

    setup(): void {
        super.setup();

        this.performanceRenderer = new PerformanceRenderer(this.game.performanceRecorder, [
            {'color': '#f00', 'renderer': renderFramerate('FRAME')},
            {'color': '#08f', 'renderer': renderExecutionTime('GAME_LOOP')},
            {'color': '#ff0', 'renderer': renderExecutionTime('RENDER')},
            {'color': '#00f', 'renderer': renderExecutionTime('UPDATE_VIEWS')},
        ], Math.max(2, window.innerWidth / this.game.performanceRecorder.frames.length));

        this.performanceRendererContainer.appendChild(this.performanceRenderer.view);
    }

    setRendererVisible(visible: boolean) {
        this.visible = visible;
        this.performanceRendererContainer.style.display = visible ? 'block' : 'none';
    }

    cycle(elapsed: number): void {
        if (this.visible) {
            this.performanceRenderer.update();
        }
    }
}
