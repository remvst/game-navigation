import { isDown } from "@remvst/client-inputs";
import { navigationFlow } from "@remvst/game-navigation-core";
import { THREEGamePlugin, THREEScreen } from "@remvst/game-navigation-three";
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera } from "three";
import { KEY_BINDINGS } from "../key-binding-settings";
import { ColorPickerScreen } from "./color-picker-screen";
import { InstructionsScreen } from "./instructions-screen";
import { SpinningSquareScreen } from "./spinning-square-screen";

export class SpinningCubeScreen extends THREEScreen {
    readonly id = "spinning-cube";

    private readonly cube = (() => {
        const cube = new Mesh(
            new BoxGeometry(1, 1, 1),
            new MeshBasicMaterial({ color: this.color }),
        );
        return cube;
    })();

    constructor(private color: number) {
        super();
        this.addSubscreen(new InstructionsScreen());
    }

    setup(): void {
        super.setup();
        this.game.plugin(THREEGamePlugin).renderer.domElement.style.visibility =
            "visible";

        this.view.add(this.cube);

        this.camera = new PerspectiveCamera(
            75,
            this.width / this.height,
            0.1,
            1000,
        );
        this.camera.position.z = 5;
    }

    destroy(): void {
        super.destroy();
        this.game.plugin(THREEGamePlugin).renderer.domElement.style.visibility =
            "hidden";
    }

    cycle(elapsed: number): void {
        super.cycle(elapsed);
        this.cube.rotation.y += elapsed * Math.PI;

        if (
            this.isTakingInputs &&
            isDown(this.game.inputs, KEY_BINDINGS.binding("changeColor"))
        ) {
            this.changeColor();
        }

        if (
            this.isTakingInputs &&
            isDown(this.game.inputs, KEY_BINDINGS.binding("2dmode"))
        ) {
            this.game.screenStack.reset(new SpinningSquareScreen(this.color));
        }
    }

    private changeColor() {
        navigationFlow(
            (async () => {
                this.color = await this.game.screenStack.resolvableScreen(
                    new ColorPickerScreen(),
                );
                this.cube.material.color.setHex(this.color);
            })(),
        );
    }
}
