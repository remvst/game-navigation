import { Keyboard } from "@remvst/client-inputs";
import { GamePlugin } from "../game/game-plugin";

export class TimeKeysGamePlugin extends GamePlugin {

    static readonly key = 'time-keys';
    readonly key = TimeKeysGamePlugin.key;

    get timeFactor(): number {
        if (this.game.inputs.keyboard.isDown(Keyboard.F)) {
            return 500;
        } else if (this.game.inputs.keyboard.isDown(Keyboard.G)) {
            return 0.1;
        }

        return 1;
    }
}
