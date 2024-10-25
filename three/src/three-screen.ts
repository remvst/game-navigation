import { Screen } from "@remvst/game-navigation-core";
import { Camera, PerspectiveCamera, Renderer, Scene } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { THREEGamePlugin } from "./three-game-plugin";

export abstract class THREEScreen extends Screen {
    view: Scene;
    camera: Camera;
    composer: EffectComposer;

    setup() {
        super.setup();
        this.view = new Scene();
        this.camera = new PerspectiveCamera(
            75,
            this.width / this.height,
            0.1,
            1000,
        );
    }

    destroy() {
        super.destroy();
        this.view.parent?.remove(this.view);
    }

    cycle(elapsed: number): void {
        super.cycle(elapsed);
        this.game.plugin(THREEGamePlugin).setNeedsRerender();
    }

    get width(): number {
        return this.game.plugin(THREEGamePlugin).width;
    }

    get height(): number {
        return this.game.plugin(THREEGamePlugin).height;
    }

    get resolution(): number {
        return this.game.plugin(THREEGamePlugin).resolution;
    }

    get renderer(): Renderer {
        return this.game.plugin(THREEGamePlugin).renderer;
    }
}
