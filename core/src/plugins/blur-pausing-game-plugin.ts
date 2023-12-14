import { GamePlugin } from "../game/game-plugin";

export class BlurPausingGamePlugin extends GamePlugin {

    static readonly key = 'blur-pausing-game';
    readonly key = BlurPausingGamePlugin.key;

    setup(): void {
        super.setup();

        window.addEventListener('blur', () => this.focusChanged(), false);
        window.addEventListener('focus', () => this.focusChanged(), false);
    }

    private focusChanged() {
        if (document.hasFocus()) {
            this.game.scheduleFrame();
        } else {
            this.game.stopLoop();
        }
    }
}
