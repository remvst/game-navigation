import { GamePlugin } from "@remvst/game-navigation-core";
import { Application, Container, ICanvas, IRenderer, Text } from "pixi.js";
import { renderables, treeNodes } from "./utils";

export interface PIXIGamePluginOptions {
    readonly width: number;
    readonly height: number;
    readonly resolution: number;
    readonly antialias?: boolean;
}

export class PIXIGamePlugin extends GamePlugin {
    static readonly key = "pixi";
    readonly key = PIXIGamePlugin.key;

    private canvas: ICanvas;

    // Scene
    readonly stage = new Container();
    readonly screenContainer = new Container();

    // Rendering
    app: Application;
    renderer: IRenderer<ICanvas>;
    private needsRerender = true;

    // Debugging
    readonly debugger = (() => {
        const view = new Text("", {
            fill: "white",
            align: "left",
            fontFamily: "Courier",
            fontSize: "22px",
        });
        view.anchor.set(0, 1);
        view.resolution = 4;
        view.visible = false;
        return view;
    })();

    constructor(
        readonly canvasContainer: HTMLElement,
        private options: PIXIGamePluginOptions,
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

        this.stage.addChild(this.screenContainer, this.debugger);

        this.setOptions(this.options);
    }

    addDebugValues(values: { [key: string]: any }): void {
        super.addDebugValues(values);
        values["pixi.treeNodes"] = treeNodes(this.stage);
        values["pixi.renderables"] = renderables(this.stage);
    }

    setNeedsRerender() {
        this.needsRerender = true;
    }

    render(): void {
        super.render();

        if (!this.needsRerender) return;

        this.renderer.render(this.stage);

        if (this.debugger.visible) {
            const debug = {};
            this.game.getDebugValues(debug);
            this.debugger.text = Object.keys(debug)
                .map((key) => `${key}: ${(debug as any)[key]}`)
                .join("\n");
        }
    }

    setOptions(options: PIXIGamePluginOptions) {
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

        if (!this.app) {
            this.app = new Application({
                width: canvasWidth,
                height: canvasHeight,
                resolution: 1,
                antialias:
                    this.options.antialias === undefined
                        ? true
                        : this.options.antialias,
            });
            this.app.ticker.stop(); // core has its own ticker

            // PIXI renderer
            this.renderer = this.app.renderer;
            this.renderer.options.antialias = true;

            this.canvas = this.renderer.view;
            this.canvasContainer.appendChild(
                this.canvas as unknown as HTMLElement,
            );
        } else {
            this.renderer.resize(canvasWidth, canvasHeight);
        }

        this.stage.scale.x = this.options.resolution;
        this.stage.scale.y = this.options.resolution;

        const cssRoot = document.querySelector(":root") as HTMLElement;
        cssRoot.style.setProperty(
            "--aspect-ratio",
            `${canvasWidth} / ${canvasHeight}`,
        );

        this.updateLayout();
    }

    updateLayout() {
        this.debugger.position.set(5, this.options.height - 5);
        for (const screen of this.game.screenStack.screens) {
            screen.updateLayout();
        }
    }

    setDebugVisible(visible: boolean) {
        this.debugger.visible = visible;
    }
}
