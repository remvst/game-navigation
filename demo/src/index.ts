import { Game, Screen, AutomationGamePlugin, TimeKeysGamePlugin, BlurPausingGamePlugin } from "@remvst/game-navigation-core";
import { HTMLGamePlugin } from "@remvst/game-navigation-html";
import { PIXIGamePlugin, PIXIScreen } from "@remvst/game-navigation-pixi";
import { MyGame } from "./my-game";

window.addEventListener('load', async () => {
    const game = new MyGame({
        'width': 800,
        'height': 600,
    });
    game.setup();
});
