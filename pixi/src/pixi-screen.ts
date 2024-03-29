import { Screen } from "@remvst/game-navigation-core";
import { Container, DisplayObject } from "pixi.js";
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

    addDebugValues(values: { [key: string]: any }): void {
        super.addDebugValues(values);
        values["Views"] = treeSize(this.view);
        values["Render calls"] = renderSize(this.view);
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

function treeSize(tree: DisplayObject): number {
    if (tree instanceof Container) {
        return tree.children.reduce((acc, child) => {
            return acc + treeSize(child);
        }, 1);
    } else {
        return 1;
    }
}

function renderSize(tree: DisplayObject): number {
    if (!tree.visible) {
        return 0;
    }

    if ((tree as any).cacheAsBitmap) {
        return 1;
    }

    if (tree instanceof Container) {
        return tree.children.reduce((acc, child) => {
            return acc + renderSize(child);
        }, 1);
    } else {
        return 1;
    }
}
