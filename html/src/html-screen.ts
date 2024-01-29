import { Screen } from "@remvst/game-navigation-core";
import { HTMLGamePlugin } from "./html-game-plugin";

export abstract class HTMLScreen extends Screen {
    view: HTMLDivElement;

    setup() {
        super.setup();

        this.view = document.createElement("div");
        this.view.style.width = "100%";
        this.view.style.height = "100%";

        this.game.plugin(HTMLGamePlugin).htmlContainer.appendChild(this.view);
    }

    destroy() {
        this.view.parentNode?.removeChild(this.view);
        super.destroy();
    }

    foreground(): void {
        super.foreground();
        this.view.style.display = "block";
    }

    background(): void {
        super.background();
        this.view.style.display = "none";
    }
}
