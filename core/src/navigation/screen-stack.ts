import { OperationQueue } from "@remvst/optimization";
import { Game } from "../game/game";
import { Screen } from "../ui/screen";
import { Resolver, ResolverHolder } from "./resolver";

export enum NavigationType {
    RESET,
    PUSH,
    REPLACE_EXISTING,
}

export class ScreenStack {
    readonly screens: Screen[] = [];
    private readonly queue = new OperationQueue();
    prepareScreen: (screen: Screen) => void = () => {};

    constructor(private readonly game: Game) {}

    findByType<T extends Screen>(
        screenType: new (...params: any) => T,
    ): T | null {
        return (
            (this.screens.find((scr) => scr instanceof screenType) as T) || null
        );
    }

    current() {
        return this.screens[this.screens.length - 1] || null;
    }

    popTo(screen: Screen, inclusive: boolean = false) {
        while (this.current() && this.current() !== screen) {
            this.pop();
        }

        if (inclusive && this.current() === screen) {
            this.pop();
        }
    }

    push(screen: Screen) {
        this.queue.execute(() => {
            const previousScreen = this.current();

            screen.bind(this.game);
            screen.setup();

            this.screens.push(screen);

            if (previousScreen) {
                previousScreen.background();
            }

            screen.foreground();

            screen.cycle(0);
            screen.postCycle(0);

            this.game.onCurrentScreenChanged();
        });
    }

    replaceExisting(screen: Screen) {
        const existing = this.findByType(
            screen.constructor as new (...params: any) => Screen,
        ) as Screen;
        if (existing) this.popTo(existing, true);
        this.push(screen);
    }

    pop() {
        this.queue.execute(() => {
            const screen = this.screens.pop();
            if (screen) {
                screen.destroy();
            }

            const newScreen = this.screens[this.screens.length - 1];
            if (newScreen) {
                newScreen.foreground();
                this.game.onCurrentScreenChanged();
            }
        });
    }

    reset(screen: Screen) {
        this.queue.execute(() => {
            while (this.screens.length > 0) {
                // Not calling pop() in case the child class needs to do something in it
                const popped = this.screens.pop();
                popped.destroy();
            }

            this.push(screen);
        });
    }

    resolvableScreen<T>(
        screen: Screen & ResolverHolder<T>,
        navigationType: NavigationType = NavigationType.PUSH,
        dismissWhenResolved: boolean = true,
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            screen.resolver = new Resolver(screen, resolve, reject);
            screen.resolver.dismissWhenResolved = dismissWhenResolved;
            switch (navigationType) {
                case NavigationType.PUSH:
                    this.push(screen);
                    break;
                case NavigationType.RESET:
                    this.reset(screen);
                    break;
                case NavigationType.REPLACE_EXISTING:
                    this.replaceExisting(screen);
                    break;
            }
        });
    }
}
