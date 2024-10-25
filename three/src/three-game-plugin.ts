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
    renderer: WebGLRenderer;
    private needsRerender = true;

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

        this.renderer = new WebGLRenderer();

        this.setOptions(this.options);
        this.updateRenderer();

        this.canvasContainer.appendChild(this.renderer.domElement);
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
        this.renderer.setSize(this.options.width, this.options.height, false);
        this.renderer.setPixelRatio(this.options.resolution);

        this.updateLayout();
    }

    updateLayout() {
        for (const screen of this.game.screenStack.screens) {
            screen.updateLayout();
        }
    }
}
