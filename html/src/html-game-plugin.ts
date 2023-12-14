import { GamePlugin } from "@remvst/game-navigation-core";

export class HTMLGamePlugin extends GamePlugin {

    static readonly key = 'html';
    readonly key = HTMLGamePlugin.key;

    constructor(
        readonly htmlContainer: HTMLElement,
    ) {
        super();
    }

    setup(): void {
    }

    render(): void {
        // no-op
    }
}
