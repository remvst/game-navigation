import { GamePlugin } from "../game/game-plugin";

export class DOMDebuggerGamePlugin extends GamePlugin {
    static readonly key = "dom-debugger";
    readonly key = DOMDebuggerGamePlugin.key;

    #visible = true;
    readonly #container: HTMLElement;

    readonly domElement = (() => {
        const elt = document.createElement("div");
        elt.className = "dom-debugger";
        elt.style.position = "absolute";
        elt.style.top = "0";
        elt.style.left = "0";
        elt.style.fontSize = "10px";
        elt.style.color = "white";
        elt.style.fontFamily = "monospace";
        return elt;
    })();

    constructor(readonly container: HTMLElement = document.body) {
        super();
        this.#container = container;
    }

    get visible() {
        return this.#visible;
    }

    set visible(value: boolean) {
        this.#visible = value;
        if (this.domElement) {
            this.domElement.style.display = value ? "block" : "none";
        }
    }

    setup(): void {
        super.setup();
        this.#container.appendChild(this.domElement);
    }

    cycle(elapsed: number): void {
        super.cycle(elapsed);

        if (!this.#visible) return;

        const debug = {};
        this.game.getDebugValues(debug);
        this.domElement.innerText = Object.keys(debug)
            .map((key) => `${key}: ${(debug as any)[key]}`)
            .join("\n");
    }
}
