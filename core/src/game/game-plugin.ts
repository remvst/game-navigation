import { Game } from "./game";
import { Screen } from '../ui/screen';

export abstract class GamePlugin {

    abstract get key(): string;

    protected game: Game;

    get timeFactor(): number {
        return 1;
    }

    bind(game: Game) {
        this.game = game;
    }

    setup(): void {

    }

    setupScreen(screen: Screen): void {

    }

    cycle(elapsed: number) {

    }

    render() {

    }
}
