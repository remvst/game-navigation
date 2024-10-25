import { isDown } from "@remvst/client-inputs";
import { navigationFlow } from "@remvst/game-navigation-core";
import { PIXIGamePlugin, PIXIScreen } from "@remvst/game-navigation-pixi";
import { Sprite, Texture } from "pixi.js";
import { KEY_BINDINGS } from "../key-binding-settings";
import { ColorPickerScreen } from "./color-picker-screen";
import { InstructionsScreen } from "./instructions-screen";
import { SpinningCubeScreen } from "./spinning-cube-screen";

export class SpinningSquareScreen extends PIXIScreen {
    readonly id = "spinning-square";

    private readonly square = (() => {
        const square = new Sprite(Texture.WHITE);
        square.width = square.height = 50;
        square.anchor.set(0.5, 0.5);
        square.tint = this.color;
        return square;
    })();

    constructor(private color: number) {
        super();
        this.addSubscreen(new InstructionsScreen());
    }

    setup(): void {
        super.setup();
        (
            this.game.plugin(PIXIGamePlugin).renderer.view as HTMLCanvasElement
        ).style.visibility = "visible";

        this.square.position.set(
            this.game.params.width / 2,
            this.game.params.height / 2,
        );
        this.view.addChild(this.square);
    }

    destroy(): void {
        super.destroy();
        (
            this.game.plugin(PIXIGamePlugin).renderer.view as HTMLCanvasElement
        ).style.visibility = "hidden";
    }

    cycle(elapsed: number): void {
        super.cycle(elapsed);
        this.square.rotation += elapsed * Math.PI;

        if (
            this.isTakingInputs &&
            isDown(this.game.inputs, KEY_BINDINGS.binding("changeColor"))
        ) {
            this.changeColor();
        }

        if (
            this.isTakingInputs &&
            isDown(this.game.inputs, KEY_BINDINGS.binding("3dmode"))
        ) {
            this.game.screenStack.reset(new SpinningCubeScreen(this.color));
        }
    }

    private changeColor() {
        navigationFlow(
            (async () => {
                this.square.tint = this.color =
                    await this.game.screenStack.resolvableScreen(
                        new ColorPickerScreen(),
                    );
            })(),
        );
    }

    mouseMove(
        x: number,
        y: number,
        movementX: number,
        movementY: number,
    ): void {
        super.mouseMove(x, y, movementX, movementY);
        this.square.position.set(x, y);
    }
}
