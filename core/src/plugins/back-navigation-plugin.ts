import { GamePlugin } from "../game/game-plugin";
import { BackNavigationListener } from "../navigation/back-navigation-listener";
import { Screen } from "../ui/screen";

export class BackNavigationPlugin extends GamePlugin {
    readonly key = 'back-navigation';

    private pushedState = false;

    setup(): void {
        super.setup();

        const { length} = history;
        if (length > 0) history.go(-length);

        window.addEventListener('popstate', () => this.onPopState());
    }

    pushState() {
        if (this.pushedState) return;
        this.pushedState = true;
        window.history.pushState({}, '', '');
    }

    popState() {
        if (!this.pushedState) return;
        this.pushedState = false;
        window.history.back();
    }

    private onPopState() {
        this.pushedState = false;

        const currentScreen = this.game.screenStack.current() as unknown as BackNavigationListener | null;
        if (!currentScreen?.onBackNavigation) return;

        this.pushState();
        currentScreen.onBackNavigation();
    }

    setupScreen(screen: Screen) {
        super.setupScreen(screen);
    }

    onCurrentScreenChanged(screen: Screen | null): void {
        const handlesBackNavigation = (screen as unknown as BackNavigationListener)?.onBackNavigation;
        if (handlesBackNavigation) {
            this.pushState();
        } else {
            this.popState();
        }
    }
}
