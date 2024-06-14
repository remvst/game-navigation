import { Screen } from "../ui/screen";
import { Game } from "./game";

export abstract class GamePlugin {
    abstract get key(): string;

    protected game: Game;

    get timeFactor(): number {
        return 1;
    }

    bind(game: Game) {
        this.game = game;
    }

    setup(): void {}

    setupScreen(screen: Screen): void {}
    onCurrentScreenChanged(screen: Screen | null): void {}

    cycle(elapsed: number) {}

    onCycleStart() {}
    onCycleEnd() {}

    onRenderStart() {}
    onRenderEnd() {}

    render() {}

    onFrameStart() {}
    onFrameEnd() {}

    addDebugValues(values: { [key: string]: any }) {}
}
