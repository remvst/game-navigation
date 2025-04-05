import { Screen } from "@remvst/game-navigation-core";
import { Container } from "pixi.js";
import { PIXIGamePlugin } from "./pixi-game-plugin";

export abstract class PIXIScreen extends Screen {
    view: Container;

    get screenContainer(): Container {
        return this.plugin.screenContainer;
    }

    get plugin(): PIXIGamePlugin {
        return this.game.plugin(PIXIGamePlugin);
    }

    setup() {
        super.setup();

        this.view = new Container();
        this.screenContainer.addChild(this.view);
    }

    destroy() {
        super.destroy();
        this.view.parent?.removeChild(this.view);
    }

    cycle(elapsed: number): void {
        super.cycle(elapsed);
        this.plugin.setNeedsRerender();
    }

    get width(): number {
        return this.plugin.width;
    }

    get height(): number {
        return this.plugin.height;
    }

    get resolution(): number {
        return this.plugin.resolution;
    }
}
