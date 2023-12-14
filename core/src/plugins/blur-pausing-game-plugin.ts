import { GamePlugin } from "../game/game-plugin";

export class BlurPausingGamePlugin extends GamePlugin {

    static readonly key = 'blur-pausing-game';
    readonly key = BlurPausingGamePlugin.key;

    hasFocus = true;

    setup(): void {
        window.addEventListener('blur', () => this.windowHasFocus(false), false);
        window.addEventListener('focus', () => this.windowHasFocus(true), false);
    }

    render(): void {
    }

    windowHasFocus(hasFocus: boolean) {
        this.hasFocus = hasFocus;
        if (hasFocus) {
            this.game.scheduleFrame();
        } else {
            this.game.stopLoop();
        }
    }
}
