import { Game, TimeKeysGamePlugin, BlurPausingGamePlugin, Screen } from "@remvst/game-navigation-core";
import { HTMLGamePlugin } from "@remvst/game-navigation-html";
import { PIXIGamePlugin } from "@remvst/game-navigation-pixi";
import { SpinningSquareScreen } from "./screens/spinning-square-screen";

export class MyGame extends Game {
    readonly plugins = [
        new PIXIGamePlugin(document.querySelector('#canvas-container')),
        new HTMLGamePlugin(document.querySelector('#html-container')),
        // new AutomationGamePlugin(1),
        new TimeKeysGamePlugin(),
        new BlurPausingGamePlugin(),
    ];

    setup(): void {
        super.setup();

        this.plugin(PIXIGamePlugin).setDebugVisible(true);

        this.screenStack.reset(new SpinningSquareScreen(0xffffff));
    }

    setupScreen(screen: Screen): void {
    }

    readonly container = document.querySelector('#game-container') as HTMLDivElement;
}
