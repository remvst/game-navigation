import {
    BlurPausingGamePlugin,
    FullscreenButtonGamePlugin,
    Game,
    TimeKeysGamePlugin,
    VersionLabelGamePlugin,
} from "@remvst/game-navigation-core";
import { HTMLGamePlugin } from "@remvst/game-navigation-html";
import { PIXIGamePlugin } from "@remvst/game-navigation-pixi";
import { SpinningSquareScreen } from "./screens/spinning-square-screen";

export class MyGame extends Game {
    readonly plugins = [
        new PIXIGamePlugin(document.querySelector("#canvas-container")),
        new HTMLGamePlugin(document.querySelector("#html-container")),
        // new AutomationGamePlugin(1),
        new TimeKeysGamePlugin(),
        new BlurPausingGamePlugin(),
        new FullscreenButtonGamePlugin(
            document.querySelector("#game-container"),
        ),
        new VersionLabelGamePlugin(
            document.querySelector("#game-container"),
            "VERSION ONE - EARLY ACCESS",
            "color: red;",
        ),
    ];

    setup(): void {
        super.setup();

        this.plugin(PIXIGamePlugin).setDebugVisible(true);

        this.screenStack.reset(new SpinningSquareScreen(0xffffff));
    }

    readonly container = document.querySelector(
        "#game-container",
    ) as HTMLDivElement;
}
