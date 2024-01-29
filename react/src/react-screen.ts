import { HTMLScreen } from "@remvst/game-navigation-html";
import { createRoot, Root } from "react-dom/client";

export abstract class ReactScreen extends HTMLScreen {
    private root: Root;
    private rootContainer = document.createElement("div");

    abstract rootComponent(): Promise<React.ReactElement>;

    setup() {
        super.setup();

        this.root = createRoot(this.rootContainer);
        this.rootComponent().then((component) => {
            this.root?.render(component);
        });

        this.rootContainer.style.width = "100%";
        this.rootContainer.style.height = "100%";
    }

    foreground(): void {
        super.foreground();
        this.view.style.display = "block";
        this.view.appendChild(this.rootContainer);
    }

    background(): void {
        super.background();
        this.view.style.display = "none";
        this.rootContainer.parentNode?.removeChild(this.rootContainer);
    }

    destroy() {
        super.destroy();
        this.root.unmount();
        this.root = null;
    }

    rebuild() {
        this.root.unmount();
        this.root = createRoot(this.rootContainer);
        this.rootComponent().then((component) => this.root.render(component));
    }
}
