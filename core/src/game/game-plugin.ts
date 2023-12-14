import { Game } from "./game";
import { Screen } from '../ui/screen';

export abstract class GamePlugin {

    protected game: Game;

    get timeFactor(): number {
        return 1;
    }

    bind(game: Game) {
        this.game = game;
    }

    setupScreen(screen: Screen): void {

    }

    abstract get key(): string;
    abstract setup(): void;
    abstract render(): void;
}
