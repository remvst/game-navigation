import { IRenderer, Container, Text, autoDetectRenderer } from 'pixi.js';
import { GamePlugin } from "@remvst/game-navigation-core";

export class PIXIGamePlugin extends GamePlugin {

    static readonly key = 'pixi';
    readonly key = PIXIGamePlugin.key;

    private canvas: HTMLCanvasElement;

    // Scene
    stage = new Container();
    screenContainer = new Container();

    // Rendering
    renderer: IRenderer<HTMLCanvasElement>;

    // Debugging
    protected debugger = (() => {
        const view = new Text('', {
            'fill': 'white',
            'align': 'left',
            'fontFamily': 'Courier',
            'fontSize': '22px',
        });
        view.anchor.set(0, 1);
        view.resolution = 4;
        view.visible = false;
        return view;
    })();

    constructor(
        readonly canvasContainer: HTMLElement,
        private resolution: number = 1,
    ) {
        super();
    }

    setup(): void {
        super.setup();

        this.debugger.position.set(5, this.game.params.height - 5);
        this.stage.addChild(this.screenContainer, this.debugger);

        this.setResolution(this.resolution);
    }

    render(): void {
        super.render();

        this.renderer.render(this.stage);

        if (this.debugger.visible) {
            const debug = {};
            this.game.getDebugValues(debug);
            this.debugger.text = Object.keys(debug).map((key) => `${key}: ${(debug as any)[key]}`).join('\n');
        }
    }

    setResolution(resolution: number) {
        if (resolution === this.resolution && this.renderer) {
            return;
        }

        this.resolution = resolution;

        const canvasWidth = this.game.params.width * this.resolution;
        const canvasHeight = this.game.params.height * this.resolution;

        if (!this.renderer) {
            // PIXI renderer
            this.renderer = autoDetectRenderer<HTMLCanvasElement>({
                'width': canvasWidth,
                'height': canvasHeight,
                'resolution': 1,
                'antialias': true,
            });

            this.renderer.options.antialias = true;

            this.canvas = this.renderer.view;
            this.canvasContainer.appendChild(this.canvas);
        } else {
            this.renderer.resize(canvasWidth, canvasHeight);
        }

        this.stage.scale.x = resolution;
        this.stage.scale.y = resolution;

        const cssRoot = document.querySelector(':root') as HTMLElement;
        cssRoot.style.setProperty('--aspect-ratio', `${canvasWidth} / ${canvasHeight}`);
    }

    setDebugVisible(visible: boolean) {
        this.debugger.visible = visible;
    }
}
