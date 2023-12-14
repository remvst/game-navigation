import { ColorPickerScreen } from './color-picker-screen';
import { Keyboard, KeyBindingsSettings, BindingDefinition, BindingDefinitionSet, set, keyboard, isDown } from '@remvst/client-inputs';
import { PIXIScreen } from "@remvst/game-navigation-pixi";
import { Sprite, Texture } from "pixi.js";

export class SpinningSquareScreen extends PIXIScreen {
    readonly id ='spinning-square';

    private readonly square = (() => {
        const square = new Sprite(Texture.WHITE);
        square.width = square.height = 50;
        square.anchor.set(0.5, 0.5);
        square.tint = this.color;
        return square;
    })();

    private readonly keyBindingSettings = (() => {
        const definitions = new BindingDefinitionSet([
            new BindingDefinition('navigation', 'back', 'Back', true, set(keyboard(Keyboard.ESC), keyboard(Keyboard.BACKSPACE))),
        ]);

        return new KeyBindingsSettings(definitions);
    })();

    constructor(private readonly color: number) {
        super();
    }

    setup(): void {
        super.setup();

        this.square.position.set(this.game.params.width / 2, this.game.params.height / 2);
        this.view.addChild(this.square);

        this.changeColor();
    }

    cycle(elapsed: number): void {
        super.cycle(elapsed);
        this.square.rotation += elapsed * Math.PI;

        if (this.isForeground && isDown(this.game.inputs, this.keyBindingSettings.binding('back'))) {
            this.changeColor();
        }
    }

    async changeColor() {
        const color = await this.game.screenStack.resolvableScreen(new ColorPickerScreen());
        this.square.tint = color;
    }

    mouseMove(x: number, y: number, movementX: number, movementY: number): void {
        super.mouseMove(x, y, movementX, movementY);
        this.square.position.set(x, y);
    }
}
