import { ColorPickerScreen } from './color-picker-screen';
import { Keyboard, KeyBindingsSettings, BindingDefinition, BindingDefinitionSet, set, keyboard, isDown } from '@remvst/client-inputs';
import { navigationFlow } from '@remvst/game-navigation-core';
import { PIXIScreen } from "@remvst/game-navigation-pixi";
import { Sprite, Texture, Text } from "pixi.js";

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
            new BindingDefinition('navigation', 'changeColor', 'Change Color', true, set(keyboard(Keyboard.ESC), keyboard(Keyboard.BACKSPACE))),
        ]);

        return new KeyBindingsSettings(definitions);
    })();

    private readonly instruction = (() => {
        const text = new Text('', {
            fill: '#fff',
            align: 'center',
        });

        text.text = this.keyBindingSettings.definitionSet.definitions
            .map((definition) => {
                const label = definition.label
                const keys = this.keyBindingSettings.binding(definition.key).bindings.map(binding => binding.label).join(' / ');

                return `${label}: ${keys}`;
            })
            .join('\n')

        text.anchor.set(0.5, 0);
        return text;
    })();

    constructor(private readonly color: number) {
        super();
    }

    setup(): void {
        super.setup();

        this.square.position.set(this.game.params.width / 2, this.game.params.height / 2);
        this.view.addChild(this.square);

        this.instruction.position.set(this.game.params.width / 2, 20)
        this.view.addChild(this.instruction);

        this.changeColor();
    }

    cycle(elapsed: number): void {
        super.cycle(elapsed);
        this.square.rotation += elapsed * Math.PI;

        if (this.isTakingInputs && isDown(this.game.inputs, this.keyBindingSettings.binding('changeColor'))) {
            this.changeColor();
        }

        this.instruction.visible = this.isTakingInputs;
    }

    private changeColor() {
        navigationFlow((async () => {
            this.square.tint = await this.game.screenStack.resolvableScreen(new ColorPickerScreen());
        })())
    }

    mouseMove(x: number, y: number, movementX: number, movementY: number): void {
        super.mouseMove(x, y, movementX, movementY);
        this.square.position.set(x, y);
    }
}
