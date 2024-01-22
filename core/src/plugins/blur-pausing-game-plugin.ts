import { GamePlugin } from "../game/game-plugin";

export class BlurPausingGamePlugin extends GamePlugin {

    static readonly key = 'blur-pausing-game';
    readonly key = BlurPausingGamePlugin.key;

    private _enabled = false;

    get enabled() {
        return this._enabled;
    }

    set enabled(enabled: boolean) {
        this._enabled = enabled;
        this.updateLoop();
    }

    setup(): void {
        super.setup();

        window.addEventListener('blur', () => this.updateLoop(), false);
        window.addEventListener('focus', () => this.updateLoop(), false);
    }

    private updateLoop() {
        if (document.hasFocus() || !this._enabled) {
            this.game.scheduleFrame();
        } else {
            this.game.stopLoop();
        }
    }
}
