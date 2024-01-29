import { Keyboard } from "@remvst/client-inputs";
import { GamePlugin } from "../game/game-plugin";

export class TimeKeysGamePlugin extends GamePlugin {
    static readonly key = "time-keys";
    readonly key = TimeKeysGamePlugin.key;

    speedUpFactor: number;
    slowDownFactor: number;

    constructor(
        options: {
            speedUpFactor?: number;
            slowDownFactor?: number;
        } = {},
    ) {
        super();

        this.speedUpFactor = options.speedUpFactor || 10;
        this.slowDownFactor = options.slowDownFactor || 0.25;
    }

    get timeFactor(): number {
        if (this.game.inputs.keyboard.isDown(Keyboard.F)) {
            return this.speedUpFactor;
        } else if (this.game.inputs.keyboard.isDown(Keyboard.G)) {
            return this.slowDownFactor;
        }

        return 1;
    }
}
