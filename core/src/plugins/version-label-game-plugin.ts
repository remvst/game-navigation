import { GamePlugin } from "../game/game-plugin";

export class VersionLabelGamePlugin extends GamePlugin {

    static readonly key = "version-label";
    readonly key = VersionLabelGamePlugin.key;

    constructor(
        private readonly container: HTMLElement,
        private readonly label: string,
        private readonly extraStyle: string = '',
    ) {
        super();
    }

    setup(): void {
        super.setup();

        const button = document.createElement('div');
        button.innerText = this.label;
        button.style.cssText = `
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
        `;
        this.container.appendChild(button);
    }
}
