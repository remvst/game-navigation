import { Screen } from "../ui/screen";

export class UserCancelledError extends Error {
    constructor(
        message: string = "User backed out and cancelled navigation flow",
    ) {
        super(message);
    }
}

export class Resolver<T> {
    private readonly screen: Screen;
    readonly resolve: (value: T) => void;
    readonly reject: (error: Error) => void;

    dismissWhenResolved = true;
    private resolved = false;

    constructor(
        screen: Screen,
        resolve: (value: T) => void,
        reject: (error: Error) => void,
    ) {
        this.screen = screen;
        this.resolve = (value) => {
            if (this.resolved) return;
            this.resolved = true;

            if (this.dismissWhenResolved) {
                this.dismiss();
            }
            resolve(value);
        };
        this.reject = (err) => {
            if (this.resolved) return;
            this.resolved = true;

            if (this.dismissWhenResolved) {
                this.dismiss();
            }
            reject(err);
        };
    }

    private dismiss() {
        this.screen.game.screenStack.pop();
    }
}

export interface ResolverHolder<T> {
    resolver: Resolver<T>;
}
