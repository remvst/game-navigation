import { GamePlugin } from "../game/game-plugin";

export class VersionLabelGamePlugin extends GamePlugin {
    static readonly key = "version-label";
    readonly key = VersionLabelGamePlugin.key;

    readonly labelElement = (() => {
        const label = document.createElement("div");
        label.className = "version-label";
        label.innerText = this.label;
        return label;
    })();

    readonly styleElement = (() => {
        const styleElt = document.createElement("style");
        styleElt.innerHTML = `
            .version-label {
                position: absolute;
                z-index: 2;
                margin: 10px;
                color: #fff;
                bottom: 0;
                right: 0;
                text-transform: uppercase;
                text-shadow: 0px 2px 0px #000;
                font-family: Courier;
                font-size: 10px;
                ${this.extraStyle}
            }
        `;
        return styleElt;
    })();

    constructor(
        private readonly container: HTMLElement,
        private readonly label: string,
        private readonly extraStyle: string = "",
    ) {
        super();
    }

    setup(): void {
        super.setup();

        document.head.appendChild(this.styleElement);
        this.container.appendChild(this.labelElement);
    }
}
