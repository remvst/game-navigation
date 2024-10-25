import {
    BackNavigationPlugin,
    BlurPausingGamePlugin,
    FullscreenButtonGamePlugin,
    Game,
    TimeKeysGamePlugin,
    VersionLabelGamePlugin,
} from "@remvst/game-navigation-core";
import { HTMLGamePlugin } from "@remvst/game-navigation-html";
import { PerformanceGamePlugin } from "@remvst/game-navigation-performance";
import { PIXIGamePlugin } from "@remvst/game-navigation-pixi";
import { SoundGamePlugin } from "@remvst/game-navigation-sound";
import { THREEGamePlugin } from "@remvst/game-navigation-three";
import * as PIXI from "pixi.js";
import { SpinningSquareScreen } from "./screens/spinning-square-screen";

export class MyGame extends Game {
    readonly plugins = [
        new PIXIGamePlugin(document.querySelector("#canvas-container"), {
            resolution: window.devicePixelRatio,
            width: this.params.width,
            height: this.params.height,
        }),
        new THREEGamePlugin(document.querySelector("#canvas-container"), {
            resolution: window.devicePixelRatio,
            width: this.params.width,
            height: this.params.height,
        }),
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
        new PerformanceGamePlugin(
            document.body.querySelector("#perf-container"),
        ),
        new SoundGamePlugin(),
        new BackNavigationPlugin(),
    ];

    setup(): void {
        super.setup();

        this.plugin(PIXIGamePlugin).setDebugVisible(true);
        this.plugin(PerformanceGamePlugin).setRendererVisible(true);

        this.plugin(PerformanceGamePlugin).gameStats.enableExtension("pixi", [
            PIXI,
            this.plugin(PIXIGamePlugin).app,
        ]);

        this.screenStack.reset(new SpinningSquareScreen(0xffffff));
    }

    readonly container = document.querySelector(
        "#game-container",
    ) as HTMLDivElement;
}
