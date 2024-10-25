import { GamePlugin } from "@remvst/game-navigation-core";
import { WebGLRenderer } from "three";
import { THREEScreen } from "./three-screen";

export interface THREEGamePluginOptions {
    readonly width: number;
    readonly height: number;
    readonly resolution: number;
    readonly antialias?: boolean;
}

export class THREEGamePlugin extends GamePlugin {
    static readonly key = "three";
    readonly key = THREEGamePlugin.key;

    // Rendering
    renderer: WebGLRenderer = (() => {
        const renderer = new WebGLRenderer();
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(this.options.width, this.options.height);
        return renderer;
    })();
    private needsRerender = true;

    private canvas: HTMLCanvasElement = (() => {
        return this.renderer.domElement;
    })();

    constructor(
        readonly canvasContainer: HTMLElement,
        private options: THREEGamePluginOptions,
    ) {
        super();
    }

    get width(): number {
        return this.options.width;
    }
    get height(): number {
        return this.options.height;
    }
    get resolution(): number {
        return this.options.resolution;
    }

    setup(): void {
        super.setup();

        this.setOptions(this.options);

        this.canvasContainer.appendChild(this.canvas);
    }

    addDebugValues(values: { [key: string]: any }): void {
        super.addDebugValues(values);
        // TODO
    }

    setNeedsRerender() {
        this.needsRerender = true;
    }

    render(): void {
        super.render();

        if (!this.needsRerender) return;

        for (const screen of this.game.screenStack.screens) {
            if (!(screen instanceof THREEScreen)) continue;

            if (screen.composer) {
                screen.composer.render();
            } else {
                this.renderer.render(screen.view, screen.camera);
            }
        }
    }

    setOptions(options: THREEGamePluginOptions) {
        if (this.renderer) {
            if (
                options.antialias === this.options.antialias &&
                options.resolution === this.options.resolution &&
                options.width === this.options.width &&
                options.height === this.options.height
            ) {
                return;
            }
        }

        this.options = options;
        this.updateRenderer();
    }

    updateRenderer() {
        const canvasWidth = this.options.width * this.options.resolution;
        const canvasHeight = this.options.height * this.options.resolution;

        this.renderer.setSize(canvasWidth, canvasHeight);
        this.renderer.setPixelRatio(this.options.resolution);

        this.renderer.domElement.style.width = null;
        this.renderer.domElement.style.height = null;

        this.updateLayout();
    }

    updateLayout() {
        for (const screen of this.game.screenStack.screens) {
            screen.updateLayout();
        }
    }
}
