import { Game, Screen, AutomationGamePlugin, TimeKeysGamePlugin, BlurPausingGamePlugin } from "@remvst/game-navigation-core";
import { HTMLGamePlugin } from "@remvst/game-navigation-html";
import { PIXIGamePlugin } from "@remvst/game-navigation-pixi";

class MyGame extends Game {
    readonly plugins = [
        new PIXIGamePlugin(document.body),
        new HTMLGamePlugin(document.body),
        new AutomationGamePlugin(),
        new TimeKeysGamePlugin(),
        new BlurPausingGamePlugin(),
    ];

    setupScreen(screen: Screen): void {
    }

    readonly container = document.body;
}

window.addEventListener('load', async () => {
    const game = new MyGame({
        'width': 400,
        'height': 400,
    });
    game.setup();


});
