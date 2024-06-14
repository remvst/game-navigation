import { Screen } from "@remvst/game-navigation-core";
import { Container } from "pixi.js";
import { PIXIGamePlugin } from "./pixi-game-plugin";

export abstract class PIXIScreen extends Screen {
    view: Container;

    setup() {
        super.setup();

        this.view = new Container();
        this.game.plugin(PIXIGamePlugin).screenContainer.addChild(this.view);
    }

    destroy() {
        super.destroy();
        this.view.parent?.removeChild(this.view);
    }

    cycle(elapsed: number): void {
        super.cycle(elapsed);
        this.game.plugin(PIXIGamePlugin).setNeedsRerender();
    }

    get width(): number {
        return this.game.plugin(PIXIGamePlugin).width;
    }

    get height(): number {
        return this.game.plugin(PIXIGamePlugin).height;
    }

    get resolution(): number {
        return this.game.plugin(PIXIGamePlugin).resolution;
    }
}
