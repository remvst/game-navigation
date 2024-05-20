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

        this.view.appendChild(this.rootContainer);
    }

    destroy() {
        super.destroy();
        this.root?.unmount();
        this.root = null;
    }

    rebuild() {
        this.root?.unmount();

        const root = createRoot(this.rootContainer);
        this.root = root;

        this.rootComponent().then((component) => {
            if (this.root !== root) return;
            this.root?.render(component);
        });
    }
}
